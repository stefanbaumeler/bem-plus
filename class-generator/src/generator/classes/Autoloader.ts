import { Block } from './Block'
import { AUTO_GENERATED_DISCLAIMER } from '../const'
import path from 'node:path'
import fs from 'fs'
import { TBemPlusClassGeneratorConfigOutput } from '../schema'
import { getFileContents } from '../../helpers'

export class Autoloader {
    matchers = {
        export: new RegExp('(?<=export \\* from [\'"`]).*(?=[\'"`])', 'g')
    }
    constructor(public config: TBemPlusClassGeneratorConfigOutput, public blocks: Block[]) {}

    async write() {
        const autoGeneratedDisclaimerString = `/* ${AUTO_GENERATED_DISCLAIMER} */`
        const mapsString = this.blocks.filter((block) => block.module.length).map((block) => block.autoloader).join(',\n')
        const fullMap = `${autoGeneratedDisclaimerString}\n\nexport default {\n${mapsString}\n}\n`
        const fileName = `autoloader.${this.config.output.language}`
        const filePath = path.resolve(this.config.output.path, fileName)

        const existing = await getFileContents([filePath])

        if (existing.length) {
            if (JSON.stringify(existing[0].contents) !== JSON.stringify(fullMap)) {
                await fs.promises.writeFile(filePath, fullMap, {
                    flag: 'w'
                })
            }
        }
    }
}
