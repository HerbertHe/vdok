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
 * 锚点定位
 * @param anchor 锚点
 */
export function ToAnchor(anchor: string) {
    const to = document.querySelector(anchor) as HTMLHeadingElement
    if (!to) {
        return
    }
    // TODO 添加滚动事件监听, 动态更新对应锚点的颜色
    location.hash = anchor
    scrollTo({
        top: to.offsetTop - 80,
    })
}
