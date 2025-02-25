import path from 'node:path'
import { TBemPlusClassGeneratorConfigOutput } from '../schema'
import { Element } from './Element'
import { Block } from './Block'

export class DistBlock extends Block {
    constructor({
        config, name, elementStrings, allModifiers
    }: {
        config: TBemPlusClassGeneratorConfigOutput
        name: string
        elementStrings: string[]
        allModifiers: string[]
    }) {
        super(config, name)

        const absolutePath = path.resolve(
            this.config.output.path,
            config.output.filename(this.name, config.output.language)
        )

        this.output = path.relative(process.cwd(), absolutePath)
        this.setImportExport()
        this.getElements(elementStrings, allModifiers)
        this.generateModule()
    }

    async setAutoloader() {
        this.autoloader = `    '.${this.name}': '${this.output}'`
    }

    getElements(elementStrings: string[], allModifiers: string[]) {
        this.elements = ['root', ...elementStrings]
            .map((elementString) => new Element({
                config: this.config,
                name: elementString.split(this.config.input.separators.element)[0],
                blockName: this.name,
                allModifiers
            }))
    }
}
