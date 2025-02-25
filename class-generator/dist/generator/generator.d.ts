import { TBemPlusClassGeneratorConfigOutput } from './schema';
import { PlusBlock } from './classes/PlusBlock';
import { Block } from './classes/Block';
export declare class BemPlusClassGenerator {
    config: TBemPlusClassGeneratorConfigOutput;
    distPath: string;
    blocks: Block[];
    matchers: {
        bemSeparator: RegExp;
        blockElement: RegExp;
        blockElementModifier: RegExp;
        elementMixins: (block: string) => RegExp;
        elementName: (block: string) => RegExp;
        subSelectors: RegExp;
        ampModifier: RegExp;
        subModifier: RegExp;
    };
    constructor(config: TBemPlusClassGeneratorConfigOutput, distPath: string);
    generate(): Promise<void>;
    initBlocks(): Promise<void>;
    writeModules(): Promise<void>;
    getPlusBlocks(): Promise<PlusBlock[]>;
    getDistBlocks(): Promise<Block[]>;
    getPlusModifiers(filePaths: string[]): Promise<string[]>;
    validateSeparators(): void;
    getBuiltContent(): Promise<string>;
}
