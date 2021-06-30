import React from "react"

const SideOutlineNavs = () => (
    <div className="w-full flex flex-col h-full shadow py-20px px-10px">
        {/* 展示logo */}
        <h1 className="w-full text-center text-bold text-red-500">Vdok</h1>
        {/* 展示文档名 */}
        <ul className="h-auto overflow-auto mt-20px">
            <li>路径1</li>
            <li>路径2</li>
        </ul>
    </div>
)

export default SideOutlineNavs
