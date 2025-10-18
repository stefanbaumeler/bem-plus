import { TBemPlusClassGeneratorProjectConfig } from '../schema';
export declare class Element {
    config: TBemPlusClassGeneratorProjectConfig;
    name: string;
    escapedName: string;
    selector: string;
    props: {
        [key: string]: string;
    };
    modifiers: {
        name: string;
        escaped: boolean;
    }[];
    matchers: {
        elementProps: (block: string, element: string) => RegExp;
        invalidFirstCharacter: RegExp;
    };
    constructor({ config, name, blockName, allModifiers, context }: {
        config: TBemPlusClassGeneratorProjectConfig;
        name: string;
        blockName: string;
        allModifiers: string[];
        context?: string;
    });
    getProps(context: string, blockName: string): void;
    generateTemplates(block: string, isTypeScript: boolean): {
        class: string;
        reference: string;
        property: string;
    };
}
