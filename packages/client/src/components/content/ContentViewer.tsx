import React, { FC, useEffect } from "react"
import { useRequest } from "ahooks"
import { withRouter, useLocation } from "react-router-dom"
import { DivideFeatures } from "@herberthe/vdok-shared"

import SideOutlineNavs from "./SideOutlineNavs"
import VditorContainer from "./VditorContainer"
import Footer from "../layouts/Footer"
import Loading from "../errors/Loading"
import GetContentError from "../errors/GetContentError"
import ContentOutline from "./ContentOutline"
import ContentHeader from "./ContentHeader"
import { GenerateContentOutline } from "../../utils/outline"
import PrevNext from "../extra/PrevNext"

import { ImportMeta } from "../../utils/import-meta"
import VdokConfig from "../../../vdok.config"

// TODO 这个路径处理的部分可以踢出去
function getMarkdownContent(path: string): Promise<string> {
    const isDev: boolean = !!VdokConfig.dev ? true : false
    let target: string = ""
    let local: string = "/docs"
    // 获取文档路径
    const rootRegExp = new RegExp(`http(s)?:\/\/${VdokConfig.root}`)
    const doc = path.replace(rootRegExp, "")

    if (!isDev) {
        const GitHubRegExp = /^http(s)?:\/\/github.com\//
        if (GitHubRegExp.test(VdokConfig.base || "")) {
            const [user, repo] =
                VdokConfig.base || "".replace(GitHubRegExp, "").split("/")
            // 更新与静态 `/docs` 下
            target = `//cdn.jsdelivr.net/gh/${user}/${repo}@${VdokConfig.branch}/docs${doc}.md`
        } else {
            // TODO 不是来自于GitHub
        }
    } else {
        local += `${doc}.md`
    }

    return new Promise((resolve, reject) => {
        // 处理是否是开发模式
        fetch(isDev ? local : target)
            .then(async (res: Response) => {
                const data = await res.text()
                if (res.status === 404) {
                    reject({ status: res.status, statusText: res.statusText })
                }
                resolve(data)
            })
            .catch((err: Error) => reject(err))
    })
}

/**
 * TODO: 路由需要处理移除带有 _index 的路径, 暂时不处理, 意义不大
 */
const ContentViewer: FC = () => {
    const { pathname } = useLocation()

    const { data, error, loading, run } = useRequest(getMarkdownContent, {
        manual: true,
    })

    // 改为钩子触发
    useEffect(() => {
        run(pathname)
    }, [pathname])

    useEffect(() => {
        const meta = import.meta as ImportMeta
        if (meta.hot) {
            meta.hot.on("vdok:doc-update", (data) => {
                const file = data.file as string
                // 根据路径进行性能优化
                // TODO 还可以改动Vditor免二次挂载更新, 再进行性能优化减少 DOM 操作
                console.log(`[vdok] markdown file changed: ${file}`)
                if (file.replace("/docs", "").replace(".md", "") === pathname) {
                    run(pathname)
                }
            })
        }
    }, [])

    return (
        <div className="w-full">
            <div className="w-260px h-screen fixed left-0 top-0 bg-white z-100 <lg:(hidden)">
                <SideOutlineNavs />
            </div>
            <div className="w-full ml-260px h-60px fixed top-0 bg-white z-99 shadow dark:(bg-dark-700 text-white) <lg:(ml-0)">
                <ContentHeader />
            </div>
            <div className="w-auto ml-260px mr-150px px-45px mt-70px <lg:(ml-0) <md:(mr-0)">
                {/* {loading && <Loading />} */}
                {!!error && <GetContentError error={error} />}
                {!!data && (
                    <VditorContainer markdown={DivideFeatures(data)[1]} />
                )}
                {/* <PrevNext /> */}
                <Footer />
            </div>
            <div
                className="w-150px fixed right-0 top-60px p-3 shadow bg-white dark:(bg-dark-800 text-white) <md:(hidden)"
                style={{
                    height: "calc(100vh - 60px)",
                }}
            >
                <div className="text-gray-400 font-bold mb-3">Outline</div>
                <ContentOutline
                    outlines={
                        !!data
                            ? GenerateContentOutline(
                                  DivideFeatures(data)[1] as string
                              )
                            : []
                    }
                />
            </div>
        </div>
    )
}

export default withRouter(ContentViewer)
