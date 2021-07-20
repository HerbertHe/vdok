import React, { FC } from "react"
import { LinkInterrupt } from "@icon-park/react"

interface IError extends Error {
    status?: number
    statusText?: string
}

interface IGetContentError {
    error: IError
}

/**
 * 获取文本网络错误
 */
const GetContentError: FC<IGetContentError> = ({ error }) => {
    console.log(error)

    return (
        <div className="w-full flex flex-col justify-start items-center py-20">
            <LinkInterrupt theme="outline" size="80" fill="#d43e2a" />
        </div>
    )
}

export default GetContentError
