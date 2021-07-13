interface ISideNavItem {
    title: string;
    url?: string;
}
interface ISideNavSection extends ISideNavItem {
    section: string;
    index: string;
    navs: Array<ISideNavItem>;
}
interface IHeaderItem extends ISideNavItem {
    navs?: Array<IHeaderItem>;
}
interface IHeader {
    navs: Array<IHeaderItem>;
}
interface ISideNavs {
    headers?: Array<IHeaderItem>;
    navs: Array<ISideNavSection>;
}
interface IRouteItem {
    lang: string;
    sections: Array<ISideNavSection>;
}

/**
 * IVdok配置类型定义
 */
interface IVdokConfig {
    [key: string]: any;
    dev?: boolean;
    base?: string;
    branch?: string;
    root?: string;
    lang?: string;
    footer?: string;
}
/**
 * Vdok配置定义帮助函数
 * @param config 配置项
 */
declare function defineConfig(config: IVdokConfig): IVdokConfig;

export { IHeader, IHeaderItem, IRouteItem, ISideNavItem, ISideNavSection, ISideNavs, IVdokConfig, defineConfig };
