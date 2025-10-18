export declare class BemPlusModule<TRoot extends Element | HTMLElement = HTMLElement> {
    type: string;
    rootClass: string;
    index: number;
    refresh: () => void;
    constructor(rootElement: TRoot, k?: number);
}
