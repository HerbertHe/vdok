import { IRouteItem } from "@herberthe/vdok-types"
import VdokConfig from "../vdok.config"

const { lang } = VdokConfig

const routes: Array<IRouteItem> = /* inject-routes-here */ new Array()

const route =
    routes.length === 1
        ? routes[0]
        : !!lang
        ? routes.filter((item) => item.lang === lang)
        : routes[0]

export { routes, route }
