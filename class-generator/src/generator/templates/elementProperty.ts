import { camel, colonType } from '../../helpers'

export const elementPropertyTemplate = ({
    isTypeScript,
    className,
    element,
    single
}: {
    isTypeScript: boolean
    className: string
    element: string
    single?: boolean
}) => `${camel(element)}${colonType(`${className}${single ? '' : '[]'}`, isTypeScript, single)}${single ? '' : ' = []'}\n`

