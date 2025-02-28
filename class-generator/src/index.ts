import {
    BemPlusClassGeneratorConfig,
    TBemPlusClassGeneratorConfigInput,
    TBemPlusClassGeneratorConfigOutput
} from './generator/schema'
import { BemPlusClassGenerator } from './generator/generator'

export * from './module'

export class BemPlusClassGeneratorPlugin {
    options: TBemPlusClassGeneratorConfigOutput
    constructor(options: TBemPlusClassGeneratorConfigInput) {
        this.options = BemPlusClassGeneratorConfig.parse(options)
    }
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    apply(compiler: any) {
        const callback = () => {
            const generator = new BemPlusClassGenerator(this.options, compiler.outputPath)
            generator.generate()
        }

        compiler.hooks.afterEmit.tap('@bem-plus/class-generator plugin', callback)
    }
}
