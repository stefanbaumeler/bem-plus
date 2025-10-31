import path from 'node:path'
import fs from 'fs'
import { EOutputMode } from '../types'
import { TBemPlusClassGeneratorProjectConfig } from '../schema'
import { Element } from './Element'
import { Block } from './Block'
import { getFileContents } from '../../helpers'

export class PlusBlock extends Block {
    input = ''
    inputPath
    templateTagMap
    matchers = {
        removeComments: (input: string) => input.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*/g, ''),
        element: (block: string) => new RegExp(`(?<=&${this.config.input.separators.element})[^\\s{(]*(?=.*\\r?\\n.*@include ${block}${this.config.input.separators.mixinElement})`, 'g'),
        templateElement: (block: string) => new RegExp(`(?<= ?${block}${this.config.input.separators.element})[^- ]+(?:-[^- ]+)*(?=--| |$)`, 'g'),
        hasIndex: (block: string) => new RegExp(`@mixin ${block}[^.-]*\\.${block} {`),
        hasAnElement: (block: string) => new RegExp(`@mixin ${block}${this.config.input.separators.mixinElement}.*`),
        rootProps: (block: string) => new RegExp(`(?<=@mixin ${block}${this.config.input.separators.mixinElement}root\\s*\\()[^)]*`, 'g')
    }

    allModifiers: string[]

    constructor ({
        config, inputPath, allModifiers, templateTagMap
    }: {
        config: TBemPlusClassGeneratorProjectConfig
        inputPath: string
        allModifiers: string[]
        templateTagMap: {
            [key: string]: string
        }
    }) {
        super(config)

        this.allModifiers = allModifiers
        this.inputPath = inputPath
        this.templateTagMap = templateTagMap

        const fileName = path.parse(inputPath).name
        this.name = fileName.startsWith('_') ? fileName.substring(1) : fileName

        const absolutePath = path.resolve(config.output.mode === EOutputMode.relative
            ? path.dirname(inputPath)
            : this.config.output.path,
        config.output.filename(this.name, config.output.language))

        this.output = path.relative(process.cwd(), absolutePath)
        this.importExport = this.getImportExport()
    }

    getAutoloader = async () => {
        const modulePath = path.relative(process.cwd(), path.resolve(`${path.dirname(this.inputPath)}/${path.parse(this.inputPath).name}.${this.config.output.language}`))
        const existing = await getFileContents([modulePath])

        return `    '.${this.name}': '${existing.length ? modulePath : this.output}'`
    }

    init = async () => {
        const buffer = await fs.promises.readFile(this.inputPath).then((buffer) => buffer.toString())
        this.input = this.matchers.removeComments(buffer)

        if (!this.verifyFileIsBlock()) {
            return
        }

        this.elements = this.getElements()

        const rootElement = this.elements.find((el) => el.name === 'root')

        this.module = this.generateModule(rootElement?.props.type)
    }

    getElements = () => {
        const styleMatches = ['root', ...this.input?.match(this.matchers.element(this.name)) || []]
        const flatMap = Object.values(this.templateTagMap).join(' ')
        const templateMatches = [...new Set(flatMap.match(this.matchers.templateElement(this.name)) || [])].filter((entry) => !styleMatches.includes(entry))

        return [...styleMatches, ...templateMatches]
            .map((match) => {
                const tags = match === 'root' ? [] : Object.entries(this.templateTagMap)
                    .filter(([,value]) => ` ${value} `.includes(` ${this.name}${this.config.input.separators.element}${match} `))
                    .map(([key]) => key)

                return new Element({
                    config: this.config,
                    name: match.trim(),
                    blockName: this.name,
                    allModifiers: this.allModifiers,
                    context: this.input,
                    tags
                })
            })
    }

    verifyFileIsBlock = () => {
        const oneElementMatch = this.input.match(this.matchers.hasAnElement(this.name))
        const hasIndexMatch = this.input.match(this.matchers.hasIndex(this.name))

        return oneElementMatch?.length && hasIndexMatch?.length
    }
}
