import { Element } from '../classes/Element'
import { TSeparators } from '../types'

export const elementIndexEntryTemplate = ({
    element,
    separators
}: {
    element: Element
    separators: TSeparators
}) =>
    `&${separators.element}${element.name} {
        @include ${element.block}${separators.mixinElement}${element.name};
    }`
