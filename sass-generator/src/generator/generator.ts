import { TBemPlusSassGeneratorConfigOutput } from './schema'
import { glob } from 'glob'
import { Block } from './classes/Block'
import { getFileContents } from '../helpers'

export class BemPlusSassGenerator {
    constructor (public config: TBemPlusSassGeneratorConfigOutput) {
    }
    async generate () {
        const template = await this.getAllTemplates()
        const blocks = await this.getBlocks(template)

        const updatePromises = blocks.map((block) => block.update())
        await Promise.all(updatePromises)
    }

    getBlocks = async (template: string) => {
        const filePaths = await glob('**/*.{scss,sass}', {
            ignore: 'node_modules/**'
        })

        const fileContents = await getFileContents(filePaths)

        return fileContents.filter((loadedFile) => {
            const isSuccess = loadedFile.success
            const isAutomated = loadedFile.contents.includes('@use \'@bem-plus\'') || loadedFile.contents.includes('@use "@bem-plus"')

            return isSuccess && isAutomated
        }).map((automatedFile) => {
            return new Block({
                config: this.config,
                inputPath: automatedFile.path,
                input: automatedFile.contents,
                template
            })
        })
    }

    async getAllTemplates () {
        const filePaths = await glob(this.config.input.include, {
            ignore: this.config.input.exclude
        })

        const fileContents = await getFileContents(filePaths)

        return fileContents.filter((loadedFile) => loadedFile.success).map((file) => file.contents).join('\n\n######\n\n')
    }
}
