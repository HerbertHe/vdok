import React from "react"
import ReactDOM from "react-dom"
import "virtual:windi.css"
import "./index.css"
import App from "./App"

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
)


// TODO 处理开发模式下, markdown文件实现HMR