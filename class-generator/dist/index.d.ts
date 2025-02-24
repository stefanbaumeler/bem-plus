import { TBemPlusClassGeneratorConfigInput, TBemPlusClassGeneratorConfigOutput } from './generator/schema';
export declare class BemPlusClassGeneratorPlugin {
    options: TBemPlusClassGeneratorConfigOutput;
    constructor(options: TBemPlusClassGeneratorConfigInput);
    apply(compiler: any): void;
}
