import { Block } from './Block';
import { TBemPlusClassGeneratorProjectConfig } from '../schema';
export declare class Autoloader {
    config: TBemPlusClassGeneratorProjectConfig;
    blocks: Block[];
    matchers: {
        export: RegExp;
    };
    constructor(config: TBemPlusClassGeneratorProjectConfig, blocks: Block[]);
    write(): Promise<void>;
}
