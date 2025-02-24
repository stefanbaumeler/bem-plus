import { TBemPlusClassGeneratorConfigOutput } from './schema';
import { PlusBlock } from './classes/PlusBlock';
import { Block } from './classes/Block';
export declare class BemPlusClassGenerator {
    config: TBemPlusClassGeneratorConfigOutput;
    distPath: string;
    dist: string;
    blocks: Block[];
    allModifiers: string[];
    matchers: {
        bemSeparator: RegExp;
        blockElement: RegExp;
        blockElementModifier: RegExp;
    };
    constructor(config: TBemPlusClassGeneratorConfigOutput, distPath: string);
    generate(): Promise<void>;
    initBlocks(): Promise<void>;
    writeModules(): Promise<void>;
    getPlusBlocks(): Promise<PlusBlock[]>;
    getDistBlocks(): Block[];
    validateSeparators(): void;
    getBuiltContent(): Promise<string>;
}
