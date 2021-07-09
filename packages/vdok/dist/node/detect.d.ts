export interface IDetectEffectiveSection {
    section: string;
    files: Array<string>;
}
export interface IDetectEffectiveFiles {
    lang: string;
    sections: Array<IDetectEffectiveSection>;
}
export declare function detectEffectiveFiles(): Array<IDetectEffectiveFiles>;
