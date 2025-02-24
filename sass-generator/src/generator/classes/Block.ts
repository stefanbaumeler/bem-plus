import { TBemPlusSassGeneratorConfigOutput } from '../schema'
import path from 'path'
import fs from 'fs'
import { Element } from './Element'
import { unique } from '../../helpers'
import { indexTemplate } from '../templates/blockIndex'

export class Block {
    config: TBemPlusSassGeneratorConfigOutput
    inputPath: string
    input: string
    template: string
    name: string
    elements: Element[]
    matchers = {
        element: (block: string) => new RegExp(`(?<=${block}${this.config.output.separators.element}).*?(?=(--)|["'\\s])`, 'g')
    }

    constructor({
        config, inputPath, input, template
    }: {
        config: TBemPlusSassGeneratorConfigOutput
        inputPath: string
        input: string
        template: string
    }) {
        this.config = config
        this.inputPath = inputPath
        this.input = input
        this.template = template
        this.name = path.parse(this.inputPath).name

        const matches = this.template.match(this.matchers.element(this.name))

        this.elements = unique(['root', ...matches ?? []]).map((match) => new Element({
            config: this.config,
            template: this.template,
            blockFile: this.input,
            block: this.name,
            name: match
        }))
    }

    async update() {
        const elementMixins = this.elements.map((element) => element.mixin).join('\n\n')
        const index = this.generateIndex()
        const full = `@use '@bem-plus';\n\n${elementMixins}\n\n${index}\n`

        console.log(full)

        if (full !== this.input) {
            await fs.promises.writeFile(this.inputPath, full, {
                flag: 'w'
            })
        }
    }

    generateIndex() {
        return indexTemplate({
            block: this.name,
            elements: this.elements,
            separators: this.config.output.separators
        })
    }
}
