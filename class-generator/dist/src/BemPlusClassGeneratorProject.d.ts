import { TBemPlusClassGeneratorProjectConfig } from './generator/schema';
import type { Compilation } from 'webpack';
export declare class BemPlusClassGeneratorProject {
    config: TBemPlusClassGeneratorProjectConfig;
    prevTimestamps: Map<string, number>;
    constructor(config: TBemPlusClassGeneratorProjectConfig);
    getChangedFiles: (compilation: Compilation) => string[];
}
