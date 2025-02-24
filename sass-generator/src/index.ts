import {
    BemPlusSassGeneratorConfig,
    TBemPlusSassGeneratorConfigInput,
    TBemPlusSassGeneratorConfigOutput
} from './generator/schema'
import { BemPlusSassGenerator } from './generator/generator'

export class BemPlusSassGeneratorPlugin {
    options: TBemPlusSassGeneratorConfigOutput
    constructor(options: TBemPlusSassGeneratorConfigInput) {
        this.options = BemPlusSassGeneratorConfig.parse(options)
    }
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    apply(compiler: any) {
        const callback = () => {
            const generator = new BemPlusSassGenerator(this.options)

            generator.generate()
        }

        compiler.hooks.afterEmit.tap('BEMPlus Sass Generator Plugin', callback)
    }
}
