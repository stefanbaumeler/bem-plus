import { camel, colonType } from '../../helpers'
import { TSeparators } from '../types'

export const modifierTemplate = ({
    block,
    element,
    modifier,
    isTypeScript,
    separators
}: {
    block: string
    element: string
    modifier: string
    isTypeScript: boolean
    separators: TSeparators
}) => `
get ${camel(modifier)}() {
    return this.el.classList.contains('${block}${element.length ? `${separators.element}${element}` : ''}${separators.modifier}${modifier}');
}

set ${camel(modifier)}(value${colonType('boolean', isTypeScript)}) {
    this.el.classList.toggle('${block}${element.length ? `${separators.element}${element}` : ''}${separators.modifier}${modifier}', value);
}
`
