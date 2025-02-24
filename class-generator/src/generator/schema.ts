import { z } from 'zod'
import { EOutputLanguage, EOutputMode, EStrategy } from './types'

const defaults = {
    strategy: EStrategy.dist,
    input: {
        include: ['**/*.{scss,sass}'],
        exclude: ['node_modules/**'],
        excludeBlocks: [],
        separators: {
            element: '__',
            modifier: '--',
            mixinElement: '-'
        }
    },
    output: {
        autoloader: false,
        language: EOutputLanguage.ts,
        mode: EOutputMode.absolute,
        path: './.bem-plus',
        filename: (blockName: string, fileType: string) => `${blockName}.generated.${fileType}`,
        prefix: '',
        suffix: '',
        elementClass: (elementName: string) => `${elementName}Element`,
        moduleClass: (moduleClass: string) => moduleClass,
        onComplete: () => {}
    }
}

export const BemPlusClassGeneratorConfig = z.object({
    strategy: z.enum(['plus', 'dist']),
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
        autoloader: z.boolean().default(defaults.output.autoloader),
        language: z.enum(['js', 'ts']).default(defaults.output.language),
        mode: z.enum(['relative', 'absolute']).default(defaults.output.mode),
        path: z.string().default(defaults.output.path),
        filename: z.function().args(z.string(), z.string()).returns(z.string()).default(() => defaults.output.filename),
        prefix: z.string().default(defaults.output.prefix),
        suffix: z.string().default(defaults.output.suffix),
        elementClass: z.function().args(z.string()).returns(z.string()).default(() => defaults.output.elementClass),
        moduleClass: z.function().args(z.string()).returns(z.string()).default(() => defaults.output.moduleClass),
        onComplete: z.function().default(() => defaults.output.onComplete)
    }).default(defaults.output)
}).default(defaults)

export type TBemPlusClassGeneratorConfigInput = z.input<typeof BemPlusClassGeneratorConfig>
export type TBemPlusClassGeneratorConfigOutput = z.output<typeof BemPlusClassGeneratorConfig>
