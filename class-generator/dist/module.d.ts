export declare class BemPlusModule<TRoot extends HTMLElement = HTMLElement> {
    static selector: string;
    refresh: () => void;
    constructor(rootElement: TRoot, ...dependencies: (BemPlusModule | BemPlusModule[] | undefined)[]);
}
type Constructor<T> = new (...args: never[]) => T;
declare class Dependencies {
    private factories;
    register<T>(token: Constructor<T> | Constructor<T>[], factory: () => T | T[]): void;
    resolve<T>(token: Constructor<T> | Constructor<T>[]): T | T[];
}
export declare const modules: {
    selector: string;
    module: BemPlusModule;
}[];
export declare const dependencyContainer: Dependencies;
export declare const addModule: <TModule extends typeof BemPlusModule, TDependency extends {
    new (rootEl: HTMLElement): BemPlusModule;
    selector: string;
} | {
    new (rootEl: HTMLElement): BemPlusModule;
    selector: string;
}[]>(ModuleClass: TModule, dependencies?: TDependency[]) => void;
export declare const onDocumentReady: (callback: () => void) => void;
export {};
