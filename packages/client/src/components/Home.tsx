import React, { FC, useEffect } from "react"
import { useRequest } from "ahooks"
import { useLocation } from "react-router-dom"

import Footer from "./layouts/Footer"
import Header from "./layouts/Header"

import { route } from "../routes"
import VditorContainer from "./content/VditorContainer"
import { getIndexMarkdownContent } from "../utils/content"
import { ConvertHeadingMagic, DivideFeatures } from "../utils/shared"

import { ImportMeta } from "../utils/import-meta"

const Home: FC = () => {
    const { pathname } = useLocation()

    const { data, error, loading, run } = useRequest(getIndexMarkdownContent, {
        manual: true,
    })

    useEffect(() => {
        const _index = route.index
        if (!!_index) {
            run()
        }
    }, [pathname])

    useEffect(() => {
        const meta = import.meta as ImportMeta
        if (meta.hot) {
            meta.hot.on("vdok:doc-update", (data) => {
                const file = data.file as string
                // 根据路径进行性能优化
                // TODO 还可以改动Vditor免二次挂载更新, 再进行性能优化减少 DOM 操作
                console.log(`[vdok] markdown file changed: ${file}`)
                const { origin, href } = location
                if (origin === href.substring(0, href.length - 1)) {
                    run()
                }
            })
        }
    }, [])

    return (
        <div className="w-full">
            <header className="w-full h-70px">
                <Header />
            </header>
            <main className="w-full">
                {/* TODO 支持完全的文档插入自定义 HTML */}
                {/* TODO 考虑 feature 中新增 style 样式进行注入 */}
                {/* <div className="bg-gray-100 h-300px flex flex-col justify-center items-center dark:(bg-dark-500 text-light-900)">
                    Hero
                </div> */}
                {/* 在此添加Vditor渲染 */}
                {!!data && (
                    <div className="px-14 <lg:(px-0)">
                        <VditorContainer
                            markdown={ConvertHeadingMagic(
                                DivideFeatures(data)[1]
                            )}
                        />
                    </div>
                )}
            </main>
            <footer className="w-full">
                <Footer />
            </footer>
        </div>
    )
}

export default Home
