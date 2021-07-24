import React, { FC, useEffect } from "react"
import { useRequest } from "ahooks"
import { withRouter, useLocation } from "react-router-dom"

import SideOutlineNavs from "./SideOutlineNavs"
import VditorContainer from "./VditorContainer"
import Footer from "../layouts/Footer"
import Loading from "../errors/Loading"
import GetContentError from "../errors/GetContentError"
import ContentOutline from "./ContentOutline"
import ContentHeader from "./ContentHeader"
import PrevNext from "../extra/PrevNext"

import { ImportMeta } from "../../utils/import-meta"
import { getDocumentMarkdownContent } from "../../utils/content"
import { DivideFeatures, ConvertHeadingMagic } from "../../utils/shared"
import { GenerateContentOutline } from "../../utils/outline"

import "../../styles/content/content-viewer.less"

/**
 * TODO: 路由需要处理移除带有 _index 的路径, 暂时不处理, 意义不大
 */
const ContentViewer: FC = () => {
    const { pathname } = useLocation()

    const { data, error, loading, run } = useRequest(
        getDocumentMarkdownContent,
        {
            manual: true,
        }
    )

    // 改为钩子触发
    useEffect(() => {
        run(pathname)
    }, [pathname])

    useEffect(() => {
        const meta = import.meta as ImportMeta
        if (meta.hot) {
            meta.hot.on("vdok:doc-update", (data) => {
                const file = data.file as string
                // 根据路径进行性能优化
                // TODO 还可以改动Vditor免二次挂载更新, 再进行性能优化减少 DOM 操作
                console.log(`[vdok] markdown file changed: ${file}`)
                if (file.replace("/docs", "").replace(".md", "") === pathname) {
                    run(pathname)
                }
            })
        }
    }, [])

    return (
        <div className="w-full">
            <div className="vdok-layout-side-outline-navs">
                <SideOutlineNavs />
            </div>
            <div className="vdok-layout-content-header">
                <ContentHeader />
            </div>
            <div className="vdok-layout-content-container">
                {/* {loading && <Loading />} */}
                {!!error && <GetContentError error={error} />}
                {!!data && (
                    <VditorContainer
                        markdown={ConvertHeadingMagic(DivideFeatures(data)[1])}
                    />
                )}
                {/* <PrevNext /> */}
                <Footer />
            </div>
            <div className="vdok-layout-content-outline">
                <ContentOutline
                    outlines={
                        !!data
                            ? GenerateContentOutline(
                                  ConvertHeadingMagic(
                                      DivideFeatures(data)[1] as string
                                  )
                              )
                            : []
                    }
                />
            </div>
        </div>
    )
}

export default withRouter(ContentViewer)
