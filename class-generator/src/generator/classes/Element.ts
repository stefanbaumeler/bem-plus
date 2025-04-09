import { TBemPlusClassGeneratorConfigOutput } from '../schema'
import { camel, pascal, unique } from '../../helpers'
import { modifierTemplate } from '../templates/modifier'
import { elementClassTemplate } from '../templates/elementClass'
import { elementReferenceTemplate } from '../templates/elementReference'
import { elementPropertyTemplate } from '../templates/elementProperty'
import messages from '../messages'
import { RESERVED_NAMES } from '../const'
import { elementArgumentTemplate } from '../templates/elementArgumentTemplate'

export class Element {
    config
    name
    escapedName
    selector
    props: {
        [key: string]: string
    } = {
            type: 'HTMLElement'
        }
    modifiers: {
        name: string
        escaped: boolean
    }[]
    matchers = {
        elementProps: (block: string, element: string) => new RegExp(`(?<=@mixin ${block}${this.config.input.separators.mixinElement}${element}.*\\()[^)]*`, 'g'),
        invalidFirstCharacter: new RegExp('^[\\d-].*', 'g')
    }

    constructor({
        config, name, blockName, allModifiers, context
    }: {
        config: TBemPlusClassGeneratorConfigOutput
        name: string
        blockName: string
        allModifiers: string[]
        context?: string
    }) {
        this.name = name

        if (RESERVED_NAMES.includes(camel(name))) {
            console.warn(messages.reservedElement(blockName, name))
            this.escapedName = `_${name}`
        }

        if ((name.match(this.matchers.invalidFirstCharacter) || []).length) {
            console.warn(messages.numericElement(blockName, name))
            this.escapedName = `_${name}`
        }
        else {
            this.escapedName = name
        }

        this.config = config
        this.selector = name === 'root' ? blockName : `${blockName}${config.input.separators.element}${name}`

        const rawModifiers = unique(allModifiers.filter((modifier) => modifier.startsWith(`${this.selector}${config.input.separators.modifier}`)))
        this.modifiers = rawModifiers.map((rawModifier) => {
            const modifier = rawModifier.split(config.input.separators.modifier).pop() ?? ''

            if (RESERVED_NAMES.includes(modifier)) {
                console.warn(messages.reservedModifier(this.selector, modifier))

                return {
                    name: modifier,
                    escaped: true
                }
            }

            if ((modifier.match(this.matchers.invalidFirstCharacter) || []).length) {
                console.warn(messages.numericModifier(this.selector, modifier))

                return {
                    name: modifier,
                    escaped: true
                }
            }

            return {
                name: modifier,
                escaped: false
            }
        })

        if (context) {
            this.getProps(context, blockName)
        }
    }

    getProps(context: string, blockName: string) {
        const match = context.match(this.matchers.elementProps(blockName, this.name))
        const props: { [key: string]: string } = {}

        if (match?.length) {
            const propStrings = match[0].substring(1).split(/,[ \t]*\$/g)
            propStrings.forEach((propString) => {
                const keyValue = propString.split(':')
                props[keyValue[0].trim()] = keyValue[1].trim()
            })
        }

        this.props = {
            ...this.props,
            ...props
        }
    }

    generateTemplates(block: string, isTypeScript: boolean) {
        const modifierProperties = this.modifiers.map((modifier) => {
            return modifierTemplate({
                modifier: `${modifier.escaped ? '_' : ''}${camel(modifier.name)}`,
                selector: `${block}${this.name === 'root' ? '' : `${this.config.input.separators.element}${this.name}`}${this.config.input.separators.modifier}${modifier.name}`,
                isTypeScript
            })
        })

        const className =  this.config.output.elementClass(pascal(block, this.name))

        const args = Object.entries(this.props).filter(([key]) => !['type', 'single'].includes(key)).map(([key, value]) => elementArgumentTemplate({
            key,
            value
        }))

        const elementClass = elementClassTemplate({
            isTypeScript,
            className,
            selector: `.${block}${this.name === 'root' ? '' : `${this.config.input.separators.element}${this.name}`}`,
            type: this.props.type,
            modifiers: modifierProperties.join(''),
            args: args.join('')
        })

        return {
            class: elementClass,
            reference: this.name === 'root' ? '' : elementReferenceTemplate({
                isTypeScript,
                className,
                block,
                element: this,
                separators: this.config.input.separators
            }),
            property: this.name === 'root' ? '' : elementPropertyTemplate({
                isTypeScript,
                className,
                element: this.escapedName,
                single: JSON.parse(this.props.single ?? 'false')
            })
        }
    }
}
