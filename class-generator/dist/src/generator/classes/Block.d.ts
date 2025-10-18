import { TBemPlusClassGeneratorProjectConfig } from '../schema';
import { Element } from './Element';
export declare class Block {
    config: TBemPlusClassGeneratorProjectConfig;
    name: string;
    elements: Element[];
    output: string;
    module: string;
    importExport: string;
    autoloader: string;
    constructor(config: TBemPlusClassGeneratorProjectConfig, name?: string);
    generateModule: (rootType?: string) => void;
    setImportExport: () => void;
    setAutoloader: () => Promise<void>;
    writeModule: () => Promise<void>;
    init: () => Promise<void>;
}
