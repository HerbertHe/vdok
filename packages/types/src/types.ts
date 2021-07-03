export interface ISideNavItem {
    title: string
    url?: string
}

export interface ISideNavSection extends ISideNavItem {
    section: string
    index: string
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
