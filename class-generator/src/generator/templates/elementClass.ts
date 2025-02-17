import { colonType, indent } from '../../helpers'

export const elementClassTemplate = ({
    isTypeScript,
    className,
    type,
    modifiers
}: {
    isTypeScript: boolean
    className: string
    type: string
    modifiers: string
}) =>
    `export class ${className} {
    el;
    ${indent(modifiers, 1)}
    constructor(el${colonType(type, isTypeScript)}) {
        this.el = el;
    }
}
`
