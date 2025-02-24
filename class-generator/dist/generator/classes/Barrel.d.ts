import { Block } from './Block';
import { TBemPlusClassGeneratorConfigOutput } from '../schema';
export declare class Barrel {
    config: TBemPlusClassGeneratorConfigOutput;
    blocks: Block[];
    matchers: {
        export: RegExp;
    };
    constructor(config: TBemPlusClassGeneratorConfigOutput, blocks: Block[]);
    write(): Promise<void>;
    clearObsoleteModules(): Promise<void>;
    recursivelyDeleteEmptyDir(dir: string): void;
}
