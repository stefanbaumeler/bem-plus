import { TBemPlusClassGeneratorProjectConfig } from '../schema';
export declare class Element {
    config: TBemPlusClassGeneratorProjectConfig;
    name: string;
    tags: string[];
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
    constructor({ config, name, blockName, allModifiers, context, tags }: {
        config: TBemPlusClassGeneratorProjectConfig;
        name: string;
        blockName: string;
        allModifiers: string[];
        context?: string;
        tags: string[];
    });
    getProps: (context: string, blockName: string) => {
        [x: string]: string;
    };
    generateTemplates: (block: string, isTypeScript: boolean) => {
        class: string;
        reference: string;
        property: string;
    };
    typeFromTags: () => string;
}
