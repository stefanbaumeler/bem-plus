import { colonType, indent } from '../../helpers'

export const elementClassTemplate = ({
    isTypeScript,
    className,
    selector,
    type,
    modifiers,
    args
}: {
    isTypeScript: boolean
    className: string
    selector: string
    type: string
    modifiers: string
    args: string
}) =>
    `export class ${className} {
    ${indent(modifiers, 1)}
    static el: '${selector}'
    ${indent(args, 1)}
    constructor(public el${colonType(type, isTypeScript)}) {}
}
`
