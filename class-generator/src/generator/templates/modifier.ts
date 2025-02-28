import { colonType } from '../../helpers'

export const modifierTemplate = ({
    modifier,
    selector,
    isTypeScript
}: {
    modifier: string
    selector: string
    isTypeScript: boolean
}) => `
static ${modifier} = '.${selector}'

get ${modifier}() {
    return this.el.classList.contains('${selector}')
}

set ${modifier}(value${colonType('boolean', isTypeScript)}) {
    this.el.classList.toggle('${selector}', value)
}
`
