import React, { FC, useEffect } from "react"
import { useRequest } from "ahooks"
import { withRouter, useLocation } from "react-router-dom"

import SideOutlineNavs from "./SideOutlineNavs"
import VditorContainer from "./VditorContainer"
import Footer from "../layouts/Footer"
import Loading from "../errors/Loading"
import NoContentFound from "../errors/NoContentFound"
import GetContentError from "../errors/GetContentError"
import ContentOutline from "./ContentOutline"
import ContentHeader from "./ContentHeader"
import { DivideFeatures } from "../../utils/preprocessor"
import { GenerateContentOutline } from "../../utils/outline"
import PrevNext from "../extra/PrevNext"

import VdokConfig from "../../../vdok.config"

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
                resolve(data)
            })
            .catch((err: Error) => reject(err))
    })
}

/**
 * TODO: 路由需要处理移除带有 _index 的路径
 * TODO: 修复随路径订阅获取数据
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

    return error ? (
        <GetContentError />
    ) : (
        <div className="w-full">
            <div className="w-260px h-screen fixed left-0 top-0 bg-white z-100">
                <SideOutlineNavs />
            </div>
            <div className="w-full ml-260px h-60px fixed top-0 bg-white z-99 shadow dark:(bg-dark-700 text-white)">
                <ContentHeader />
            </div>
            <div className="w-auto ml-260px mr-150px px-45px mt-70px">
                {/* {loading && <Loading />} */}
                {!!data && (
                    <VditorContainer markdown={DivideFeatures(data)[1]} />
                )}
                {!data && <NoContentFound />}
                <PrevNext />
                <Footer />
            </div>
            <div
                className="w-150px fixed right-0 top-60px p-3 shadow bg-white dark:(bg-dark-800 text-white)"
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
