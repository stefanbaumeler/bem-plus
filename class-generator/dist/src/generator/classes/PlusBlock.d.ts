import { TBemPlusClassGeneratorProjectConfig } from '../schema';
import { Block } from './Block';
export declare class PlusBlock extends Block {
    input: string;
    inputPath: string;
    matchers: {
        removeComments: (input: string) => string;
        element: (block: string) => RegExp;
        hasIndex: (block: string) => RegExp;
        hasAnElement: (block: string) => RegExp;
        rootProps: (block: string) => RegExp;
    };
    allModifiers: string[];
    constructor({ config, inputPath, allModifiers }: {
        config: TBemPlusClassGeneratorProjectConfig;
        inputPath: string;
        allModifiers: string[];
    });
    setAutoloader: () => Promise<void>;
    init: () => Promise<void>;
    getElements: () => void;
    verifyFileIsBlock: () => number | undefined;
}
