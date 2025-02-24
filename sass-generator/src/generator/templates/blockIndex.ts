import { Element } from '../classes/Element'
import { TSeparators } from '../types'

export const indexTemplate = ({
    block,
    elements,
    separators
}: {
    block: string
    elements: Element[]
    separators: TSeparators
}) =>
    `@mixin ${block} {
    @include ${block}${separators.mixinElement}root;

    ${elements.filter((element) => element.name !== 'root').map((element) => element.indexEntry).join('\n\n    ')}
}

@include ${block};`
