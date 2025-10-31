import { TBemPlusClassGeneratorProjectConfig } from '../schema';
import { Element } from './Element';
import { Block } from './Block';
export declare class DistBlock extends Block {
    constructor({ config, name, elementStrings, allModifiers }: {
        config: TBemPlusClassGeneratorProjectConfig;
        name: string;
        elementStrings: string[];
        allModifiers: string[];
    });
    getAutoloader: () => Promise<string>;
    getElements: (elementStrings: string[], allModifiers: string[]) => Element[];
}
