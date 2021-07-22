import VdokConfig from "../../vdok.config"
import { route } from "../routes"

const isDev = !!VdokConfig.dev ? true : false

const rootRegExp = new RegExp(`http(s)?:\/\/${VdokConfig.root}`)
const GitHubRegExp = /^http(s)?:\/\/github.com\//

function getContentUrlFromGitHub(base: string, doc: string) {
    const [user, repo] = base.replace(GitHubRegExp, "").split("/")

    // 更新于静态 `/docs` 下
    return `//cdn.jsdelivr.net/gh/${user}/${repo}@${VdokConfig.branch}/docs${doc}.md`
}

export function getIndexMarkdownContent(): Promise<string> {
    let target: string = ""
    let local: string = "/docs"
    if (!isDev) {
        const base = VdokConfig.base || ""
        if (GitHubRegExp.test(base)) {
            target = getContentUrlFromGitHub(base, `${route.index}`)
        } else {
            // TODO 不是来自于 GitHub
        }
    } else {
        local += `/${route.index}.md`
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

export function getDocumentMarkdownContent(path: string): Promise<string> {
    let target: string = ""
    let local: string = "/docs"
    // 获取文档路径
    const doc = path.replace(rootRegExp, "")

    if (!isDev) {
        const base = VdokConfig.base || ""
        if (GitHubRegExp.test(base)) {
            target = getContentUrlFromGitHub(base, doc)
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
