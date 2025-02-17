import { indent, angleType, colonType } from '../../helpers'

export const moduleTemplate = ({
    isTypeScript,
    className,
    elementProperties,
    elementClasses,
    rootReference,
    elementReferences,
    autoGeneratedDisclaimer,
    prefix = '',
    suffix = ''
}: {
    isTypeScript: boolean
    className: string
    elementProperties: string
    elementClasses: string
    rootReference: string
    elementReferences: string
    autoGeneratedDisclaimer: string
    prefix?: string
    suffix?: string
}) =>
    `/* ${autoGeneratedDisclaimer} */

${prefix}

import { BemPlusModule } from '@bem-plus/class-generator/module';
${elementClasses}
export class ${className} extends BemPlusModule {
    root;

    ${indent(elementProperties, 1)}
    constructor(rootElement${colonType('Element', isTypeScript)}) {
        super(${angleType('HTMLElement', isTypeScript)}rootElement)

        ${rootReference}

        this.refresh();
    }

    refresh = () => {
        ${indent(elementReferences, 2)}
    }
}

${suffix}
`
