import React, { FC } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

import ContentViewer from "./components/content/ContentViewer"
import Home from "./components/Home"

const App: FC = () => (
    <div className="w-full font-serif dark:bg-dark-900">
        <Router>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/" component={ContentViewer} />
            </Switch>
        </Router>
    </div>
)

export default App
