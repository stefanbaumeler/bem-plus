import { PACKAGE_NAME } from './const'
import colors from 'colors'
import { camel } from '../helpers'

export default {
    numericElement: (block: string, element: string) => colors.yellow(
        `${PACKAGE_NAME}: Element "${element}" of block "${block}" starts with a number or a "-". This is valid CSS but it does not result in a valid JavaScript property name. Because of this, element "${element} will be prefixed with "_": "_${camel(element)}".`
    ),
    numericModifier: (selector: string, modifier: string) => colors.yellow(
        `${PACKAGE_NAME}: Modifier "${modifier}" of selector "${selector}" starts with a number or a "-". This is valid CSS but it does not result in valid JavaScript getters and setters. Because of this, modifier "${modifier}" will be prefixed with "_": "_${camel(modifier)}".`
    ),
    reservedElement: (block: string, element: string) => colors.yellow(
        `${PACKAGE_NAME}: Element "${element}" of block "${block}" results in a method or property name that is reserved in JavaScript: "${camel(element)}". Because of this, element "${element}" will be prefixed with "_": "_${camel(element)}".`
    ),
    reservedModifier: (selector: string, modifier: string) => colors.yellow(
        `${PACKAGE_NAME}: Modifier "${modifier}" of selector "${selector} results in a method or property name that is reserved in JavaScript: "${camel(modifier)}". Because of this, modifier "${modifier}" will be prefixed with "_": "_${camel(modifier)}".`
    )
}
