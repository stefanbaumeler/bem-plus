import { z } from 'zod'
import { EOutputLanguage, EOutputMode, EStrategy } from './types'

const defaults = {
    strategy: EStrategy.dist,
    input: {
        include: ['**/*.scss'],
        exclude: ['node_modules/**'],
        excludeBlocks: [],
        separators: {
            element: '__',
            modifier: '--',
            mixinElement: '-'
        }
    },
    output: {
        language: EOutputLanguage.ts,
        mode: EOutputMode.absolute,
        path: './.bem-plus',
        filename: (blockName: string, fileType: string) => `${blockName}.generated.${fileType}`,
        prefix: '',
        suffix: '',
        elementClassPrefix: '',
        elementClassSuffix: 'Element',
        moduleClassPrefix: '',
        moduleClassSuffix: '',
        onComplete: () => {}
    }
}

export const BemPlusGeneratorConfig = z.object({
    strategy: z.nativeEnum(EStrategy),
    input: z.object({
        include: z.array(z.string()).default(defaults.input.include),
        exclude: z.array(z.string()).default(defaults.input.exclude),
        excludeBlocks: z.array(z.string()).default(defaults.input.excludeBlocks),
        separators: z.object({
            element: z.string().default(defaults.input.separators.element),
            modifier: z.string().default(defaults.input.separators.modifier),
            mixinElement: z.string().default(defaults.input.separators.mixinElement)
        }).default(defaults.input.separators)
    }).default(defaults.input),
    output: z.object({
        language: z.nativeEnum(EOutputLanguage).default(defaults.output.language),
        mode: z.nativeEnum(EOutputMode).default(defaults.output.mode),
        path: z.string().default(defaults.output.path),
        filename: z.function().args(z.string(), z.string()).returns(z.string()).default(() => defaults.output.filename),
        prefix: z.string().default(defaults.output.prefix),
        suffix: z.string().default(defaults.output.suffix),
        elementClassPrefix: z.string().default(defaults.output.elementClassPrefix),
        elementClassSuffix: z.string().default(defaults.output.elementClassSuffix),
        moduleClassPrefix: z.string().default(defaults.output.moduleClassPrefix),
        moduleClassSuffix: z.string().default(defaults.output.moduleClassSuffix),
        onComplete: z.function().default(() => defaults.output.onComplete)
    }).default(defaults.output)
}).default(defaults)

export type TBemPlusClassGeneratorConfigInput = z.input<typeof BemPlusGeneratorConfig>
export type TBemPlusClassGeneratorConfigOutput = z.output<typeof BemPlusGeneratorConfig>
