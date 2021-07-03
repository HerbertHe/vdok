export function ConvertAnchor(text: string) {
    return text.replace(/[ \.\?\:\|\<\>]/g, "-")
}
