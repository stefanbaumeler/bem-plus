import { camel, colonType } from '../../helpers'
import { TSeparators } from '../types'

export const modifierTemplate = ({
    block,
    element,
    modifier,
    escaped,
    isTypeScript,
    separators
}: {
    block: string
    element: string
    modifier: string
    escaped?: boolean
    isTypeScript: boolean
    separators: TSeparators
}) => `
get ${escaped ? '_' : ''}${camel(modifier)}() {
    return this.el.classList.contains('${block}${element.length ? `${separators.element}${element}` : ''}${separators.modifier}${modifier}');
}

set ${escaped ? '_' : ''}${camel(modifier)}(value${colonType('boolean', isTypeScript)}) {
    this.el.classList.toggle('${block}${element.length ? `${separators.element}${element}` : ''}${separators.modifier}${modifier}', value);
}
`
