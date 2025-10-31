import { TBemPlusClassGeneratorProjectConfig } from '../schema'
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
    tags
    escapedName
    selector
    props: {
        [key: string]: string
    } = {}
    modifiers: {
        name: string
        escaped: boolean
    }[]
    matchers = {
        elementProps: (block: string, element: string) => new RegExp(`(?<=@mixin ${block}${this.config.input.separators.mixinElement}${element}\\s*\\()[^)]*`, 'g'),
        invalidFirstCharacter: new RegExp('^[\\d-].*', 'g')
    }

    constructor ({
        config, name, blockName, allModifiers, context, tags
    }: {
        config: TBemPlusClassGeneratorProjectConfig
        name: string
        blockName: string
        allModifiers: string[]
        context?: string
        tags: string[]
    }) {
        this.name = name
        this.tags = tags
        this.config = config
        this.selector = name === 'root' ? blockName : `${blockName}${config.input.separators.element}${name}`

        const isReserved = RESERVED_NAMES.includes(camel(name))
        const startsInvalid = (name.match(this.matchers.invalidFirstCharacter) || []).length > 0

        if (isReserved) {
            console.warn(messages.reservedElement(blockName, name))
        }

        if (startsInvalid) {
            console.warn(messages.numericElement(blockName, name))
        }

        this.escapedName = isReserved || startsInvalid ? `_${name}` : name

        const rawModifiers = unique(allModifiers.filter((modifier) => modifier.startsWith(`${this.selector}${config.input.separators.modifier}`)))
        this.modifiers = rawModifiers.map((rawModifier) => {
            const modifier = rawModifier.split(config.input.separators.modifier).pop() ?? ''
            let warning

            if (RESERVED_NAMES.includes(modifier)) {
                warning = messages.reservedModifier(this.selector, modifier)
            } else if ((modifier.match(this.matchers.invalidFirstCharacter) || []).length) {
                warning = messages.numericModifier(this.selector, modifier)
            }

            if (warning) {
                console.warn(warning)
            }

            return {
                name: modifier,
                escaped: !!warning
            }
        })

        if (context) {
            this.props = this.getProps(context, blockName)
        }
    }

    getProps = (context: string, blockName: string) => {
        const match = context.match(this.matchers.elementProps(blockName, this.name))
        const props: { [key: string]: string } = {}

        if (match?.length) {
            const propStrings = match[0].substring(1).split(/,[ \t]*\$/g)
            propStrings.forEach((propString) => {
                const keyValue = propString.split(':')
                props[keyValue[0].trim()] = keyValue[1].trim()
            })
        }

        return {
            ...this.props,
            ...props
        }
    }

    generateTemplates = (block: string, isTypeScript: boolean) => {
        const modifierProperties = this.modifiers.map((modifier) => {
            return modifierTemplate({
                modifier: `${modifier.escaped ? '_' : ''}${camel(modifier.name)}`,
                selector: `${block}${this.name === 'root' ? '' : `${this.config.input.separators.element}${this.name}`}${this.config.input.separators.modifier}${modifier.name}`,
                isTypeScript
            })
        })

        const className = this.config.output.elementClass(pascal(block, this.name))

        const args = Object.entries(this.props).filter(([key]) => !['type', 'single'].includes(key)).map(([key, value]) => elementArgumentTemplate({
            key,
            value
        }))

        const elementType = this.props.type ?? this.typeFromTags()

        const elementClass = elementClassTemplate({
            isTypeScript,
            className,
            selector: `.${block}${this.name === 'root' ? '' : `${this.config.input.separators.element}${this.name}`}`,
            type: elementType,
            modifiers: modifierProperties.join(''),
            args: args.join('')
        })

        if (this.name === 'root') {
            return {
                class: elementClass,
                reference: '',
                property: ''
            }
        }

        return {
            class: elementClass,
            reference: elementReferenceTemplate({
                isTypeScript,
                className,
                block,
                element: this,
                separators: this.config.input.separators,
                type: elementType
            }),
            property: elementPropertyTemplate({
                isTypeScript,
                className,
                element: this.escapedName,
                single: JSON.parse(this.props.single ?? 'false')
            })
        }
    }

    typeFromTags = () => {
        const tagToType: Partial<Record<keyof HTMLElementTagNameMap, string>> = {
            a: 'HTMLAnchorElement',
            area: 'HTMLAreaElement',
            audio: 'HTMLAudioElement',
            base: 'HTMLBaseElement',
            blockquote: 'HTMLQuoteElement',
            body: 'HTMLBodyElement',
            br: 'HTMLBRElement',
            button: 'HTMLButtonElement',
            canvas: 'HTMLCanvasElement',
            caption: 'HTMLTableCaptionElement',
            col: 'HTMLTableColElement',
            colgroup: 'HTMLTableColElement',
            data: 'HTMLDataElement',
            datalist: 'HTMLDataListElement',
            del: 'HTMLModElement',
            details: 'HTMLDetailsElement',
            dialog: 'HTMLDialogElement',
            div: 'HTMLDivElement',
            dl: 'HTMLDListElement',
            embed: 'HTMLEmbedElement',
            fieldset: 'HTMLFieldSetElement',
            form: 'HTMLFormElement',
            h1: 'HTMLHeadingElement',
            h2: 'HTMLHeadingElement',
            h3: 'HTMLHeadingElement',
            h4: 'HTMLHeadingElement',
            h5: 'HTMLHeadingElement',
            h6: 'HTMLHeadingElement',
            head: 'HTMLHeadElement',
            hr: 'HTMLHRElement',
            html: 'HTMLHtmlElement',
            iframe: 'HTMLIFrameElement',
            img: 'HTMLImageElement',
            input: 'HTMLInputElement',
            ins: 'HTMLModElement',
            label: 'HTMLLabelElement',
            legend: 'HTMLLegendElement',
            li: 'HTMLLIElement',
            link: 'HTMLLinkElement',
            map: 'HTMLMapElement',
            menu: 'HTMLMenuElement',
            meta: 'HTMLMetaElement',
            meter: 'HTMLMeterElement',
            object: 'HTMLObjectElement',
            ol: 'HTMLOListElement',
            optgroup: 'HTMLOptGroupElement',
            option: 'HTMLOptionElement',
            output: 'HTMLOutputElement',
            p: 'HTMLParagraphElement',
            picture: 'HTMLPictureElement',
            pre: 'HTMLPreElement',
            progress: 'HTMLProgressElement',
            q: 'HTMLQuoteElement',
            script: 'HTMLScriptElement',
            select: 'HTMLSelectElement',
            slot: 'HTMLSlotElement',
            source: 'HTMLSourceElement',
            span: 'HTMLSpanElement',
            style: 'HTMLStyleElement',
            table: 'HTMLTableElement',
            tbody: 'HTMLTableSectionElement',
            td: 'HTMLTableCellElement',
            template: 'HTMLTemplateElement',
            textarea: 'HTMLTextAreaElement',
            tfoot: 'HTMLTableSectionElement',
            th: 'HTMLTableCellElement',
            thead: 'HTMLTableSectionElement',
            time: 'HTMLTimeElement',
            title: 'HTMLTitleElement',
            tr: 'HTMLTableRowElement',
            track: 'HTMLTrackElement',
            ul: 'HTMLUListElement',
            video: 'HTMLVideoElement'
        }

        const types = this.tags.map((tag) => tagToType[tag as keyof HTMLElementTagNameMap] ?? 'HTMLElement')

        return types.join(' | ') || 'HTMLElement'
    }
}
