import { BemPlusGeneratorConfig, TBemPlusClassGeneratorConfigInput, TBemPlusClassGeneratorConfigOutput } from './generator/schema'
import { BemPlusClassGenerator } from './generator/generator'

export class BemPlusClassGeneratorPlugin {
    options: TBemPlusClassGeneratorConfigOutput
    constructor(options: TBemPlusClassGeneratorConfigInput) {
        this.options = BemPlusGeneratorConfig.parse(options)
    }
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    apply(compiler: any) {
        const callback = () => {
            const generator = new BemPlusClassGenerator(this.options, compiler.outputPath)
            generator.generate()
        }

        // compiler.hooks.done.tap('BEMPlus Class Generator Plugin', callback)
        compiler.hooks.afterEmit.tap('BEMPlus Class Generator Plugin', callback)
    }
}
