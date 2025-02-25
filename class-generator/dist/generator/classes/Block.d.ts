import { TBemPlusClassGeneratorConfigOutput } from '../schema';
import { Element } from './Element';
export declare class Block {
    config: TBemPlusClassGeneratorConfigOutput;
    name: string;
    elements: Element[];
    output: string;
    module: string;
    importExport: string;
    autoloader: string;
    constructor(config: TBemPlusClassGeneratorConfigOutput, name?: string);
    generateModule(): void;
    setImportExport(): void;
    setAutoloader(): Promise<void>;
    writeModule(): Promise<void>;
    init(): Promise<void>;
}
