/**
 * Vdok配置模板
 */
export const VdokConfigTemplate = String.raw`// Vdok Config File through automatic generation
import { defineConfig } from "@herberthe/vdok-types"

export default defineConfig(/* Inject-Vdok-Config-Here */)
`

/**
 * Vdok Routes 模板
 */
export const VdokRoutesTemplate = String.raw`// Vdok Routes File through automatic generation
import { IRouteItem } from "@herberthe/vdok-types"
import VdokConfig from "../vdok.config"

const { lang } = VdokConfig

const routes: Array<IRouteItem> = /* inject-routes-here */

const route =
    routes.length === 1
        ? routes[0]
        : !!lang
        ? routes.filter((item) => item.lang === lang)[0]
        : routes[0]

;(<any>window).__Vdok_i18n__ = route.lang || ""

export { routes, route }
`