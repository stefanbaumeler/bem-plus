import { TBemPlusClassGeneratorInputConfig, TBemPlusClassGeneratorProjectConfig } from './generator/schema';
import { BemPlusClassGenerator } from './generator/generator';
import { Project } from './generator/classes/Project';
import type { Compiler } from 'webpack';
export declare class BemPlusClassGeneratorPlugin {
    projects: {
        project: Project;
        generator: BemPlusClassGenerator;
    }[];
    options: TBemPlusClassGeneratorProjectConfig[];
    constructor(options: TBemPlusClassGeneratorInputConfig);
    apply: (compiler: Compiler) => void;
}
