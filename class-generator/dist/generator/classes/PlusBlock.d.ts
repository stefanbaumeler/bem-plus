import { TBemPlusClassGeneratorProjectConfig } from '../schema';
import { Element } from './Element';
import { Block } from './Block';
export declare class PlusBlock extends Block {
    input: string;
    inputPath: string;
    templateTagMap: {
        [key: string]: string;
    };
    matchers: {
        removeComments: (input: string) => string;
        element: (block: string) => RegExp;
        templateElement: (block: string) => RegExp;
        hasIndex: (block: string) => RegExp;
        hasAnElement: (block: string) => RegExp;
        rootProps: (block: string) => RegExp;
    };
    allModifiers: string[];
    constructor({ config, inputPath, allModifiers, templateTagMap }: {
        config: TBemPlusClassGeneratorProjectConfig;
        inputPath: string;
        allModifiers: string[];
        templateTagMap: {
            [key: string]: string;
        };
    });
    getAutoloader: () => Promise<string>;
    init: () => Promise<void>;
    getElements: () => Element[];
    verifyFileIsBlock: () => number | undefined;
}
