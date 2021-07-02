export function SwitchTheme() {
    const html = document.getElementsByTagName("html")[0]
    if (!html.classList.contains("dark")) {
        html.classList.add("dark")
    } else {
        html.classList.remove("dark")
    }
}
