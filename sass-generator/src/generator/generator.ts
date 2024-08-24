import { TBemPlusSassGeneratorConfigOutput } from './schema'
import { EOutputMode } from './types'

export class BemPlusSassGenerator {
    outputPath: string
    constructor(public config: TBemPlusSassGeneratorConfigOutput, public distPath: string) {
        this.outputPath = config.output.mode === EOutputMode.node_modules ? '/node_modules/@bem-plus/generated' : config.output.path
    }
    generate() {

    }
}
