import { z } from 'zod'
import { EOutputLanguage, EOutputMode } from './types'

const defaults = {
    input: {
        include: ['**/*.html'],
        exclude: ['node_modules/**'],
        excludePatterns: []
    },
    output: {
        mode: EOutputMode.relative,
        path: '',
        separators: {
            element: '__',
            modifier: '--',
            mixinElement: '-'
        }
    }
}

export const BemPlusGeneratorConfig = z.object({
    input: z.object({
        include: z.array(z.string()).default(defaults.input.include),
        exclude: z.array(z.string()).default(defaults.input.exclude),
        excludePatterns: z.array(z.string()).default(defaults.input.excludePatterns)
    }).default(defaults.input),
    output: z.object({
        mode: z.nativeEnum(EOutputMode).default(defaults.output.mode),
        path: z.string().default(defaults.output.path),
        separators: z.object({
            element: z.string().default(defaults.output.separators.element),
            modifier: z.string().default(defaults.output.separators.modifier),
            mixinElement: z.string().default(defaults.output.separators.mixinElement)
        }).default(defaults.output.separators)
    }).default(defaults.output)
}).default(defaults)

export type TBemPlusSassGeneratorConfigInput = z.input<typeof BemPlusGeneratorConfig>
export type TBemPlusSassGeneratorConfigOutput = z.output<typeof BemPlusGeneratorConfig>
