import { IRouteItem } from "@herberthe/vdok-types"
import VdokConfig from "../vdok.config"

const { lang } = VdokConfig

const routes: Array<IRouteItem> = /* inject-routes-here */ new Array()

const route =
    routes.length === 1
        ? routes[0]
        : !!lang
        ? routes.filter((item) => item.lang === lang)[0]
        : routes[0]

// 路由生成的时候做一个注入
;(<any>window).__Vdok_i18n__ = !!route.lang

export { routes, route }
