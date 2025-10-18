export declare namespace externalsPresets {
    let node: boolean;
}
export declare let mode: string;
export declare namespace entry {
    let index: string;
    let module: string;
}
export declare namespace module_1 {
    let rules: {
        test: RegExp;
        use: string;
        exclude: RegExp;
    }[];
}
export { module_1 as module };
export declare namespace resolve {
    let extensions: string[];
}
export declare namespace output {
    let filename: string;
    let path: string;
    namespace library {
        let type: string;
    }
    let globalObject: string;
}
