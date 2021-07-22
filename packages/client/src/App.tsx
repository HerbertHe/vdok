import React, { FC, useEffect } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

import ContentViewer from "./components/content/ContentViewer"
import Home from "./components/Home"
import { AutoInitialLang } from "./utils/actions"

const App: FC = () => {
    useEffect(() => {
        AutoInitialLang()
    }, [])
    return (
        <div className="w-full font-serif dark:bg-dark-900">
            <Router>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/" component={ContentViewer} />
                </Switch>
            </Router>
        </div>
    )
}

export default App
