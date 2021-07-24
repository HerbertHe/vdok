import React from "react"
import ReactDOM from "react-dom"

import "virtual:windi.css"
import "@icon-park/react/styles/index.less"
import "./index.less"

import "./i18n"

import App from "./App"

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
)
