import { angleType, camel } from '../../helpers'
import { TElement, TSeparators } from '../types'

export const elementReferenceTemplate = ({
    isTypeScript,
    className,
    block,
    element,
    separators
}: {
    isTypeScript: boolean
    className: string
    prefix?: string
    suffix?: string
    block: string
    element: TElement
    separators: TSeparators
}) => `this.${camel(element.name)} = [...this.root.el.querySelectorAll${angleType(element.type, isTypeScript)}('.${block}${separators.element}${element.name}')].map((el) => new ${className}(el));`
