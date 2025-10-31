import { TBemPlusClassGeneratorProjectConfig } from '../schema';
import type { Compilation } from 'webpack';
export declare class Project {
    config: TBemPlusClassGeneratorProjectConfig;
    prevTimestamps: Map<string, number>;
    constructor(config: TBemPlusClassGeneratorProjectConfig);
    getChangedFiles: (compilation: Compilation) => string[];
}
