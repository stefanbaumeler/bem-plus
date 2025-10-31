import { TBemPlusClassGeneratorProjectConfig } from './schema';
import { PlusBlock } from './classes/PlusBlock';
import { DistBlock } from './classes/DistBlock';
export declare class BemPlusClassGenerator {
    config: TBemPlusClassGeneratorProjectConfig;
    distPath: string;
    blocks: (DistBlock | PlusBlock)[];
    templateTagMap: {
        [key: string]: string;
    };
    matchers: {
        bemSeparator: RegExp;
        blockElement: RegExp;
        blockElementModifier: RegExp;
        elementMixins: (block: string) => RegExp;
        elementName: (block: string) => RegExp;
        subSelectors: RegExp;
        ampModifier: RegExp;
        subModifier: RegExp;
        template: RegExp;
    };
    constructor(config: TBemPlusClassGeneratorProjectConfig);
    generate: (distPath: string) => Promise<void>;
    initBlocks: () => Promise<void>;
    writeModules: () => Promise<void>;
    getPlusBlocks: () => Promise<PlusBlock[]>;
    getDistBlocks: () => Promise<DistBlock[]>;
    getPlusModifiers: (filePaths: string[]) => Promise<string[]>;
    getTemplateTagMap: () => Promise<{
        [key: string]: string;
    }>;
    validateSeparators: () => void;
    getBuiltContent: () => Promise<string>;
}
