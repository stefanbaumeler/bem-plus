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
}) => {
    if (element.props.single) {
        const selector = `this.root.el.querySelector${angleType(element.props.type, isTypeScript)}('.${block}${separators.element}${element.name}')`

        return `
const ${camel(element.escapedName)} = ${selector};
this.${camel(element.escapedName)} = ${camel(element.escapedName)} ? new ${className}(${camel(element.escapedName)}) : undefined`
    }

    return `this.${camel(element.escapedName)} = [...this.root.el.querySelectorAll${angleType(element.props.type, isTypeScript)}('.${block}${separators.element}${element.name}')].map((el) => new ${className}(el))`
}
