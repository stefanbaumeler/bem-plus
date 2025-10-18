import { Block } from './Block';
import { TBemPlusClassGeneratorProjectConfig } from '../schema';
export declare class Barrel {
    config: TBemPlusClassGeneratorProjectConfig;
    blocks: Block[];
    matchers: {
        export: RegExp;
    };
    constructor(config: TBemPlusClassGeneratorProjectConfig, blocks: Block[]);
    write: () => Promise<void>;
    clearObsoleteModules: () => Promise<void>;
    recursivelyDeleteEmptyDir: (dir: string) => void;
}
