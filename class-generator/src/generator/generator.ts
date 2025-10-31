import { TBemPlusClassGeneratorProjectConfig } from './schema'
import { glob } from 'glob'
import { EOutputMode, EStrategy } from './types'
import path from 'node:path'
import { PlusBlock } from './classes/PlusBlock'
import { unique, getFileContents } from '../helpers'
import { DistBlock } from './classes/DistBlock'
import { Barrel } from './classes/Barrel'
import { SameSeparatorError } from './errors/SameSeparatorError'
import { InvalidSeparatorError } from './errors/InvalidSeparatorError'
import { Autoloader } from './classes/Autoloader'

export class BemPlusClassGenerator {
    distPath = ''
    blocks: (DistBlock | PlusBlock)[] = []
    templateTagMap: {
        [key: string]: string
    } = {}
    matchers = {
        bemSeparator: new RegExp(`${this.config.input.separators.element}|${this.config.input.separators.modifier}`),
        blockElement: new RegExp(`[^(\\d.\\r\\n]*${this.config.input.separators.element}.+?(?=${this.config.input.separators.modifier}|[ .,[:#{)>+])`, 'g'),
        blockElementModifier: new RegExp(`(?<!(var\\(|{|;))[^(.\\n!{]*${this.config.input.separators.modifier}[^ .,[:#{)>+]*`, 'g'),
        elementMixins: (block: string) => new RegExp(`(?<!(\\/\\/.*))@mixin ${block}${this.config.input.separators.mixinElement}[\\s\\S]*?(?<![ \\S])}`, 'g'),
        elementName: (block: string) => new RegExp(`(?<!(\\/\\/.*))(?<=@mixin ${block}${this.config.input.separators.mixinElement})[^{ (]*`),
        subSelectors: new RegExp('(?<!(\\/\\/.*))(&|@at-root| \\.).*(?<!([ {]))', 'g'),
        ampModifier: new RegExp(`(?<!(\\/\\/.*))(?<=&${this.config.input.separators.modifier})[^ ,:>+~.#[|)\\s]*`, 'g'),
        subModifier: new RegExp(`(?<!(\\/\\/.*))(?<=\\.)[^)\\s.]*${this.config.input.separators.modifier}[^ ),:>+~.#[|\\s]*`, 'g'),
        template: new RegExp('(<[a-zA-Z-0-9]+)(?=[^>]*class(Name)?=["\'][^"\']*(?=[ "\'])[^"\']*["\'][^>]*>)|(?<=<[^>]*class(Name)?=["\'])((?:[^"\']|@\\(.*?\\))*)(?=["\'])', 'g')
    }

    constructor (public config: TBemPlusClassGeneratorProjectConfig) {
        this.validateSeparators()
    }

    generate = async (distPath: string) => {
        this.distPath = distPath

        this.templateTagMap = await this.getTemplateTagMap()

        this.blocks = this.config.strategy === EStrategy.plus ? await this.getPlusBlocks() : await this.getDistBlocks()

        await this.initBlocks()
        await this.writeModules()

        if (this.config.output.mode === EOutputMode.absolute) {
            const barrel = new Barrel(this.config, this.blocks)

            await barrel.clearObsoleteModules()
            await barrel.write()
        }

        if (this.config.output.autoloader) {
            const autoloader = new Autoloader(this.config, this.blocks)

            await autoloader.write()
        }

        this.config.output.onComplete()
    }

    initBlocks = async () => {
        const initPromises = this.blocks.map((block) => block.init())
        await Promise.all(initPromises)
    }

    writeModules = async () => {
        const writePromises = this.blocks.map((block) => block.writeModule())
        await Promise.all(writePromises)
    }

    getPlusBlocks = async () => {
        const stylePaths = await glob(this.config.input.include, {
            ignore: this.config.input.exclude
        })

        const allModifiers = await this.getPlusModifiers(stylePaths)

        return stylePaths.map((stylePath) => new PlusBlock({
            config: this.config,
            inputPath: stylePath,
            allModifiers,
            templateTagMap: this.templateTagMap
        }))
    }

    getDistBlocks = async () => {
        const dist = await this.getBuiltContent()
        const allModifiers = dist.match(this.matchers.blockElementModifier) || []

        const elements = dist.match(this.matchers.blockElement) || []
        const blocksFromElements = elements.map((element) => element.split(this.config.input.separators.element)[0])
        const blocksFromModifiers = allModifiers.map((modifier) => modifier.split(this.matchers.bemSeparator)[0])

        return unique([...blocksFromElements, ...blocksFromModifiers])
            .filter((block) => !this.config.input.excludeBlocks.includes(block))
            .map((name) => new DistBlock({
                config: this.config,
                name,
                elementStrings: elements,
                allModifiers
            }))
    }

    getPlusModifiers = async (filePaths: string[]) => {
        const fileContents = await getFileContents(filePaths)
        let allModifiers: string[] = []

        fileContents.forEach((fileRequest) => {
            const fileName = path.parse(fileRequest.filePath!).name
            const blockName = fileName.startsWith('_') ? fileName.substring(1) : fileName

            if (fileRequest.success) {
                const elementMixins = fileRequest.contents.match(this.matchers.elementMixins(blockName))

                elementMixins?.forEach((elementMixin) => {
                    const elementName = elementMixin.match(this.matchers.elementName(blockName))
                    const subSelectors = elementMixin.match(this.matchers.subSelectors)

                    subSelectors?.forEach((selector) => {
                        const directMatches = selector.match(this.matchers.ampModifier) ?? []
                        const subMatch = selector.match(this.matchers.subModifier) ?? []

                        allModifiers.push(...subMatch)

                        directMatches.forEach((directMatch) => {
                            if (elementName![0] === 'root') {
                                allModifiers.push(`${blockName}${this.config.input.separators.modifier}${directMatch}`)
                            } else {
                                allModifiers.push(`${blockName}${this.config.input.separators.element}${elementName![0]}${this.config.input.separators.modifier}${directMatch}`)
                            }
                        })
                    })
                })
            }
        })

        return unique(allModifiers)
    }

    getTemplateTagMap = async () => {
        const templatePaths = await glob(this.config.input.templates, {
            ignore: this.config.input.exclude
        })

        const templates = await getFileContents(templatePaths)

        const tagMap: {
            [key: string]: string
        } = {}

        const matches = templates.flatMap((template) => {
            return template.contents.match(this.matchers.template) || []
        })

        matches.forEach((tagOrClass, k) => {
            if (tagOrClass.startsWith('<')) {
                const tag = tagOrClass.substring(1)

                if (matches[k + 1] && !matches[k + 1].startsWith('<')) {
                    tagMap[tag] = `${tagMap[tag] ?? ''} ${matches[k + 1].replace(/@\([^"']*(?=")|@[^ ]*|["'&|)]|\n/g, '')}`
                }
            }
        })

        return tagMap
    }

    validateSeparators = () => {
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

    getBuiltContent = async () => {
        const filePaths = await glob(`${this.distPath}/**/*.css`)
        const fileContents = await getFileContents(filePaths)

        return fileContents.map((fileContents) => fileContents.contents).join(' ')
    }
}
