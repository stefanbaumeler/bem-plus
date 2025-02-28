import { TBemPlusClassGeneratorConfigInput, TBemPlusClassGeneratorConfigOutput } from './generator/schema';
export * from './module';
export declare class BemPlusClassGeneratorPlugin {
    options: TBemPlusClassGeneratorConfigOutput;
    constructor(options: TBemPlusClassGeneratorConfigInput);
    apply(compiler: any): void;
}
