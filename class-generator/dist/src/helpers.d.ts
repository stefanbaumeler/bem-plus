export declare const camel: (str: string) => string;
export declare const pascal: (...strings: string[]) => string;
export declare const unique: (arr: string[]) => string[];
export declare const indent: (content: string, indentation: number) => string;
export declare const angleType: (typeString: string, isTypeScript: boolean) => string;
export declare const colonType: (typeString: string, isTypeScript: boolean, optional?: boolean) => string;
export declare const getFileContents: (paths: string[]) => Promise<({
    success: boolean;
    contents: string;
    filePath: string;
} | {
    success: boolean;
    contents: string;
    filePath?: undefined;
})[]>;
