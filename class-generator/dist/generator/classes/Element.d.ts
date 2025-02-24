import { TBemPlusClassGeneratorConfigOutput } from '../schema';
export declare class Element {
    config: {
        input: {
            include: string[];
            exclude: string[];
            excludeBlocks: string[];
            separators: {
                element: string;
                modifier: string;
                mixinElement: string;
            };
        };
        output: {
            filename: (args_0: string, args_1: string, ...args_2: unknown[]) => string;
            path: string;
            prefix: string;
            language: "js" | "ts";
            autoloader: boolean;
            mode: "absolute" | "relative";
            suffix: string;
            elementClass: (args_0: string, ...args_1: unknown[]) => string;
            moduleClass: (args_0: string, ...args_1: unknown[]) => string;
            onComplete: (...args: unknown[]) => unknown;
        };
        strategy: "dist" | "plus";
    };
    name: string;
    escapedName: string;
    selector: string;
    props: {
        [key: string]: string;
        type: string;
    };
    modifiers: {
        name: string;
        escaped: boolean;
    }[];
    matchers: {
        elementProps: (block: string, element: string) => RegExp;
        invalidFirstCharacter: RegExp;
    };
    constructor({ config, name, blockName, allModifiers, context }: {
        config: TBemPlusClassGeneratorConfigOutput;
        name: string;
        blockName: string;
        allModifiers: string[];
        context?: string;
    });
    getProps(context: string, blockName: string): void;
    generateTemplates(block: string, isTypeScript: boolean): {
        class: string;
        reference: string;
        property: string;
    };
}
