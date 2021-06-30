import React, { FC } from "react"
import { useRequest } from "ahooks"

import SideOutlineNavs from "./SideOutlineNavs"
import VditorContainer from "./VditorContainer"

import VdokConfig from "../../../vdok.config"

function getMarkdownContent(path: string): Promise<string> {
    let target: string = ""
    const GitHubRegExp = /^http(s)?:\/\/github.com\//
    if (GitHubRegExp.test(VdokConfig.base)) {
        const [user, repo] = VdokConfig.base
            .replace(GitHubRegExp, "")
            .split("/")
        // 获取文档路径
        const rootRegExp = new RegExp(`http(s)?:\/\/${VdokConfig.root}`)
        const doc = path.replace(rootRegExp, "")
        console.log(doc)
        target = `//cdn.jsdelivr.net/gh/${user}/${repo}@${VdokConfig.branch}${doc}.md`
    } else {
        // TODO 不是来自于GitHub
    }

    return new Promise((resolve, reject) => {
        fetch(target)
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
        <h1>┗|｀O′|┛ 嗷~~ 加载出错了</h1>
    ) : loading ? (
        <h1>加载中~</h1>
    ) : (
        <div className="w-full">
            <div className="w-260px h-screen fixed left-0 top-0 bg-white">
                <SideOutlineNavs />
            </div>
            <div className="w-auto ml-260px px-45px">
                <VditorContainer markdown={data} />
            </div>
        </div>
    )
}

export default ContentViewer
