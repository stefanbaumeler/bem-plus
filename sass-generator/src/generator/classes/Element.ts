import { TBemPlusSassGeneratorConfigOutput } from '../schema'
import { elementIndexEntryTemplate } from '../templates/elementIndexEntry'

export class Element {
    config: TBemPlusSassGeneratorConfigOutput
    template: string
    blockFile: string
    block: string
    name: string
    mixin: string
    indexEntry: string

    matchers = {
        existingElementMixin: () => new RegExp(`@mixin ${this.block}${this.config.output.separators.mixinElement}${this.name}[\\s\\S]*?((?=@mixin)|$)`, 'g')
    }

    constructor ({
        config, template, blockFile, block, name
    }: {
        config: TBemPlusSassGeneratorConfigOutput
        template: string
        blockFile: string
        block: string
        name: string
    }) {
        this.config = config
        this.template = template
        this.blockFile = blockFile
        this.block = block
        this.name = name

        const existingMixin = this.blockFile.match(this.matchers.existingElementMixin())

        if (existingMixin?.length === 1) {
            this.mixin = existingMixin[0].trim()
        } else {
            this.mixin = `@mixin ${this.block}${this.config.output.separators.mixinElement}${this.name} {\n\t\n}`
        }

        this.indexEntry = elementIndexEntryTemplate({
            element: this,
            separators: this.config.output.separators
        })
    }
}
