import React, { FC } from "react"
import { useRequest } from "ahooks"

import SideOutlineNavs from "./SideOutlineNavs"
import VditorContainer from "./VditorContainer"

import VdokConfig from "../../../vdok.config"
import Footer from "../layouts/Footer"
import NoContentFound from "../errors/NoContentFound"
import Loading from "../errors/Loading"
import GetContentError from "../errors/GetContentError"
import ContentOutline from "./ContentOutline"
import { GenerateContentOutline } from "../../utils/outline"
import ContentHeader from "./ContentHeader"
import { DivideFeatures } from "../../utils/preprocessor"

function getMarkdownContent(path: string): Promise<string> {
    const isDev: boolean = !!VdokConfig.dev ? true : false

    let target: string = ""
    let local: string = "/docs"
    // 获取文档路径
    const rootRegExp = new RegExp(`http(s)?:\/\/${VdokConfig.root}`)
    const doc = path.replace(rootRegExp, "")

    if (!isDev) {
        const GitHubRegExp = /^http(s)?:\/\/github.com\//
        if (GitHubRegExp.test(VdokConfig.base)) {
            const [user, repo] = VdokConfig.base
                .replace(GitHubRegExp, "")
                .split("/")
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

const ContentViewer: FC = () => {
    const { data, error, loading } = useRequest(() => {
        return getMarkdownContent(location.pathname)
    })

    return error ? (
        <GetContentError />
    ) : loading ? (
        <Loading />
    ) : (
        <div className="w-full">
            <div className="w-260px h-screen fixed left-0 top-0 bg-white z-100">
                <SideOutlineNavs />
            </div>
            <div className="w-full ml-260px h-60px fixed top-0 bg-white z-99 shadow dark:(bg-dark-700 text-white)">
                <ContentHeader />
            </div>
            <div className="w-auto ml-260px mr-150px px-45px mt-70px">
                {!!data && (
                    <VditorContainer markdown={DivideFeatures(data)[1]} />
                )}
                {!data && <NoContentFound />}
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
                        !!data ? GenerateContentOutline(data as string) : []
                    }
                />
            </div>
        </div>
    )
}

export default ContentViewer
