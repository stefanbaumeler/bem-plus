import { TBemPlusClassGeneratorProjectConfig } from '../schema';
import { Block } from './Block';
export declare class DistBlock extends Block {
    constructor({ config, name, elementStrings, allModifiers }: {
        config: TBemPlusClassGeneratorProjectConfig;
        name: string;
        elementStrings: string[];
        allModifiers: string[];
    });
    setAutoloader: () => Promise<void>;
    getElements: (elementStrings: string[], allModifiers: string[]) => void;
}
