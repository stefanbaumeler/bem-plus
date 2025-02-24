import path from 'node:path'
import fs from 'fs'
import { EOutputMode } from '../types'
import { TBemPlusClassGeneratorConfigOutput } from '../schema'
import { Element } from './Element'
import { Block } from './Block'
import { getFileContents } from '../../helpers'

export class PlusBlock extends Block {
    input = ''
    inputPath
    matchers = {
        removeComments: (input: string) => input.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*/g, ''),
        element: (block: string) => new RegExp(`(?<=&${this.config.input.separators.element})[^ {(]*(?=.*\\n.*@include ${block}${this.config.input.separators.mixinElement})`, 'g'),
        hasIndex: (block: string) => new RegExp(`@mixin ${block}([ \\t(]*[({]|[\\s\\S]).*[\\s\\S].*\\.${block}`),
        hasAnElement: (block: string) => new RegExp(`@mixin ${block}${this.config.input.separators.mixinElement}.*`)
    }

    constructor({
        config, inputPath, allModifiers
    }: {
        config: TBemPlusClassGeneratorConfigOutput
        inputPath: string
        allModifiers: string[]
    }) {
        super(config, allModifiers)

        this.inputPath = inputPath

        const fileName = path.parse(inputPath).name
        this.name = fileName.startsWith('_') ? fileName.substring(1) : fileName

        const absolutePath = path.resolve(
            config.output.mode === EOutputMode.relative ? path.dirname(inputPath) : this.config.output.path,
            config.output.filename(this.name, config.output.language)
        )

        this.output = path.relative(process.cwd(), absolutePath)
        this.setImportExport()
    }

    async setAutoloader() {
        const modulePath = path.relative(process.cwd(), path.resolve(`${path.dirname(this.inputPath)}/${path.parse(this.inputPath).name}.${this.config.output.language}`))
        const existing = await getFileContents([modulePath])

        this.autoloader = `    '.${this.name}': '${existing.length ? modulePath : this.output}'`
    }

    async init() {
        const buffer = await fs.promises.readFile(this.inputPath).then((buffer) => buffer.toString())
        this.input = this.matchers.removeComments(buffer)

        if (this.verifyFileIsBlock()) {
            this.getElements()
            this.generateModule()
        }
    }

    getElements() {
        const matches = ['root', ...this.input?.match(this.matchers.element(this.name)) || []]

        this.elements = (matches || []).map((match) => new Element({
            config: this.config,
            name: match.trim(),
            blockName: this.name,
            allModifiers: this.allModifiers,
            context: this.input
        }))
    }

    verifyFileIsBlock() {
        const oneElementMatch = this.input.match(this.matchers.hasAnElement(this.name))
        const hasIndexMatch = this.input.match(this.matchers.hasIndex(this.name))

        return oneElementMatch?.length && hasIndexMatch?.length
    }
}
