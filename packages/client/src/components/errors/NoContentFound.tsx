import React, { FC } from "react"
import { Error } from "@icon-park/react"
import { useTranslation } from "react-i18next"

const NoContentFound: FC = () => {
    const { t } = useTranslation("translation", { useSuspense: false })
    return (
        <div className="w-full flex flex-col justify-start items-center py-20">
            <Error theme="outline" size="80" fill="#d43e2a" />
            <div className="mt-6 font-bold text-3xl text-color-[#d43e2a]">
                {t("No Content")}
            </div>
            <div className="mt-4 text-xl dark:text-light-900">
                {t("Back")}
                <a className="vdok-special-a" href="/">
                    {t("Home")}
                </a>
                ?
            </div>
        </div>
    )
}

export default NoContentFound
