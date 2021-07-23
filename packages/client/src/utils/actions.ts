/**
 * 切换主题
 */
export function SwitchTheme() {
    const html = document.getElementsByTagName("html")[0]
    if (!html.classList.contains("dark")) {
        html.classList.add("dark")
    } else {
        html.classList.remove("dark")
    }
}

/**
 * 切换 RTL
 */
export function SwitchRTL() {
    const html = document.getElementsByTagName("html")[0]
    const dir = html.getAttribute("dir")
    if (dir === "ltr") {
        html.setAttribute("dir", "rtl")
    } else {
        html.setAttribute("dir", "ltr")
    }
}

/**
 * Auto dark mode
 * TODO: fix bugs
 */
// export function AutoDarkMode() {
//     const html = document.getElementsByTagName("html")[0]
//     if (window.matchMedia("(prefers-color-scheme: dark)")) {
//         html.classList.add("dark")
//     } else {
//         html.classList.remove("dark")
//     }
// }

export function AutoInitialLang() {
    // TODO 考虑在此自动切换 RTL
    const lang = (<any>window).__Vdok_i18n__
    if (!!lang) {
        // 插入语言标签
        const html = document.querySelector("html") as HTMLHtmlElement
        html.setAttribute("lang", lang)
        html.setAttribute("dir", "ltr")
    }
}

/**
 * 判断是否为夜间模式
 */
export const isDarkMode = document
    .getElementsByTagName("html")[0]
    .classList.contains("dark")

/**
 * 锚点定位
 * @param anchor 锚点
 */
export function ToAnchor(anchor: string) {
    const to = document.querySelector(anchor) as HTMLHeadingElement
    if (!to) {
        return
    }
    location.hash = anchor
    scrollTo({
        top: to.offsetTop - 80,
    })
}
