import { BemPlusGeneratorConfig, TBemPlusSassGeneratorConfigInput, TBemPlusSassGeneratorConfigOutput } from './generator/schema'
import { BemPlusSassGenerator } from './generator/generator'

export class BemPlusSassGeneratorPlugin {
    options: TBemPlusSassGeneratorConfigOutput
    constructor(options: TBemPlusSassGeneratorConfigInput) {
        this.options = BemPlusGeneratorConfig.parse(options)
    }
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    apply(compiler: any) {
        const callback = () => {
            const generator = new BemPlusSassGenerator(this.options, compiler.outputPath)

            generator.generate()
        }

        // compiler.hooks.done.tap('BEMPlus Class Generator Plugin', callback)
        compiler.hooks.afterEmit.tap('BEMPlus Class Generator Plugin', callback)
    }
}
