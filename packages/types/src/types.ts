export interface ISideNavItem {
    title: string
    draft?: boolean
    url?: string
}

export interface ISideNavSection extends ISideNavItem {
    section: string
    index: string
    title: string
    navs: Array<ISideNavItem>
}

export interface IHeaderItem extends ISideNavItem {
    navs?: Array<IHeaderItem>
}

export interface IHeader {
    navs: Array<IHeaderItem>
}

export interface ISideNavs {
    headers?: Array<IHeaderItem>
    navs: Array<ISideNavSection>
}

export interface IRouteItem {
    lang: string
    index: string
    sections: Array<ISideNavSection>
}
