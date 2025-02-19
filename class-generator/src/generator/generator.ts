import { TBemPlusClassGeneratorConfigOutput } from './schema'
import { glob } from 'glob'
import { EStrategy } from './types'
import path from 'node:path'
import { PlusBlock } from './classes/PlusBlock'
import { Block } from './classes/Block'
import { unique, getFileContents } from '../helpers'
import { DistBlock } from './classes/DistBlock'
import { Barrel } from './classes/Barrel'
import { SameSeparatorError } from './errors/SameSeparatorError'
import { InvalidSeparatorError } from './errors/InvalidSeparatorError'
import { Autoloader } from './classes/Autoloader'

export class BemPlusClassGenerator {
    dist = ''
    blocks: Block[] = []
    allModifiers: string[] = []
    matchers = {
        bemSeparator: new RegExp(`${this.config.input.separators.element}|${this.config.input.separators.modifier}`),
        blockElement: new RegExp(`[^(\\d.\\n]*${this.config.input.separators.element}.+?(?=${this.config.input.separators.modifier}|[ .,[:#{)>+])`, 'g'),
        blockElementModifier: new RegExp(`(?<!(var\\(|{|;))[^(.\\n!{]*${this.config.input.separators.modifier}[^ .,[:#{)>+]*`, 'g')
    }

    constructor(public config: TBemPlusClassGeneratorConfigOutput, public distPath: string) {
        this.validateSeparators()
    }

    async generate() {
        this.dist = await this.getBuiltContent()
        this.allModifiers = this.dist.match(this.matchers.blockElementModifier) || []
        this.blocks = this.config.strategy === EStrategy.plus ? await this.getPlusBlocks() : this.getDistBlocks()

        await this.initBlocks()
        await this.writeModules()

        const barrel = new Barrel(this.config, this.blocks)

        await barrel.clearObsoleteModules()
        await barrel.write()

        if (this.config.output.autoloader) {
            const autoloader = new Autoloader(this.config, this.blocks)

            await autoloader.write()
        }

        this.config.output.onComplete()
    }

    async initBlocks() {
        const initPromises = this.blocks.map((block) => block.init())
        await Promise.all(initPromises)
    }

    async writeModules() {
        const writePromises = this.blocks.map((block) => block.writeModule())
        await Promise.all(writePromises)
    }

    async getPlusBlocks() {
        const filePaths = await glob(this.config.input.include, {
            ignore: this.config.input.exclude
        })

        const fileNames = filePaths.map((filePath) => {
            const fileName = path.parse(filePath).name

            return fileName.startsWith('_') ? fileName.substring(1) : fileName
        })

        const filePathsThatNeedContent = filePaths.filter((filePath, k) => this.dist.includes(`.${fileNames[k]}`))

        return filePathsThatNeedContent.map((filePath) => new PlusBlock({
            config: this.config,
            inputPath: filePath,
            allModifiers: this.allModifiers
        }))
    }

    getDistBlocks(): Block[] {
        const elements = this.dist.match(this.matchers.blockElement) || []
        const blocksFromElements = elements.map((element) => element.split(this.config.input.separators.element)[0])
        const blocksFromModifiers = this.allModifiers.map((modifier) => modifier.split(this.matchers.bemSeparator)[0])

        return unique([...blocksFromElements, ...blocksFromModifiers])
            .filter((block) => !this.config.input.excludeBlocks.includes(block))
            .map((name) => new DistBlock({
                config: this.config,
                name,
                elementStrings: elements,
                allModifiers: this.allModifiers
            }))
    }

    validateSeparators() {
        if (this.config.input.separators.modifier === this.config.input.separators.element) {
            throw new SameSeparatorError()
        }

        if (['-', ''].includes(this.config.input.separators.modifier)) {
            throw new InvalidSeparatorError(this.config.input.separators.modifier, 'The modifier portion of a BEM selector')
        }

        if (['-', ''].includes(this.config.input.separators.element)) {
            throw new InvalidSeparatorError(this.config.input.separators.element, 'The element portion of a BEM selector')
        }

        if ([''].includes(this.config.input.separators.mixinElement)) {
            throw new InvalidSeparatorError(this.config.input.separators.mixinElement, 'The element portion of a mixin name')
        }
    }

    async getBuiltContent() {
        const filePaths = await glob(`${this.distPath}/**/*.css`)
        const fileContents = await getFileContents(filePaths)

        return fileContents.map((fileContents) => fileContents.contents).join(' ')
    }
}
