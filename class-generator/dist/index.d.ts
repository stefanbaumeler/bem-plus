import { TBemPlusClassGeneratorInputConfig, TBemPlusClassGeneratorProjectConfig } from './generator/schema';
import { BemPlusClassGenerator } from './generator/generator';
import { BemPlusClassGeneratorProject } from './BemPlusClassGeneratorProject';
import type { Compiler } from 'webpack';
export declare class BemPlusClassGeneratorPlugin {
    projects: {
        project: BemPlusClassGeneratorProject;
        generator: BemPlusClassGenerator;
    }[];
    options: TBemPlusClassGeneratorProjectConfig[];
    constructor(options: TBemPlusClassGeneratorInputConfig);
    apply(compiler: Compiler): void;
}
