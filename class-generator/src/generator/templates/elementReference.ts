import { angleType, camel } from '../../helpers'
import { TSeparators } from '../types'
import { Element } from '../classes/Element'

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
    element: Element
    separators: TSeparators
}) => `this.${camel(element.escapedName)} = [...this.root.el.querySelectorAll${angleType(element.props.type, isTypeScript)}('.${block}${separators.element}${element.name}')].map((el) => new ${className}(el));`
