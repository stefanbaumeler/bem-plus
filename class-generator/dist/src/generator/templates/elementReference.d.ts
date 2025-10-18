import { TSeparators } from '../types';
import { Element } from '../classes/Element';
export declare const elementReferenceTemplate: ({ isTypeScript, className, block, element, separators }: {
    isTypeScript: boolean;
    className: string;
    prefix?: string;
    suffix?: string;
    block: string;
    element: Element;
    separators: TSeparators;
}) => string;
