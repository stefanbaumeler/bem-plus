import { camel, colonType } from '../../helpers'

export const elementPropertyTemplate = ({
    isTypeScript,
    className,
    element
}: {
    isTypeScript: boolean
    className: string
    element: string
}) => `${camel(element)}${colonType(`${className}[]`, isTypeScript)} = []\n`

