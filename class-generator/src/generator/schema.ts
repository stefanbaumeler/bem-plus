import { z } from 'zod'
import { EOutputLanguage, EOutputMode, EStrategy } from './types'

const defaults = {
    strategy: EStrategy.dist,
    input: {
        include: ['**/*.{scss,sass}'],
        exclude: ['node_modules/**'],
        excludeBlocks: [] as string[],
        rootMixinSuffix: 'root',
        separators: {
            element: '__',
            modifier: '--',
            mixinElement: '-'
        }
    },
    output: {
        autoloader: false,
        language: EOutputLanguage.ts as 'ts' | 'js',
        mode: EOutputMode.absolute as 'relative' | 'absolute',
        path: './.bem-plus',
        filename: (blockName: string, fileType: string) => `${blockName}.generated.${fileType}`,
        prefix: '',
        suffix: '',
        elementClass: (elementName: string) => `${elementName}Element`,
        moduleClass: (moduleClass: string) => moduleClass,
        onComplete: () => {
        }
    }
}

const SeparatorsSchema = z.object({
    element: z.string().optional(),
    modifier: z.string().optional(),
    mixinElement: z.string().optional()
})

const InputSchema = z.object({
    include: z.array(z.string()).optional(),
    exclude: z.array(z.string()).optional(),
    excludeBlocks: z.array(z.string()).optional(),
    rootMixinSuffix: z.string().optional(),
    separators: SeparatorsSchema.optional()
})

const OutputSchema = z.object({
    autoloader: z.boolean().optional(),
    language: z.union([z.literal('js'), z.literal('ts')]).optional(),
    mode: z.union([z.literal('relative'), z.literal('absolute')]).optional(),
    path: z.string().optional(),
    filename: z.function().args(z.string(), z.string()).returns(z.string()).optional(),
    prefix: z.string().optional(),
    suffix: z.string().optional(),
    elementClass: z.function().args(z.string()).returns(z.string()).optional(),
    moduleClass: z.function().args(z.string()).returns(z.string()).optional(),
    onComplete: z.function().optional()
})

export const BemPlusClassGeneratorConfig = z.array(z.object({
    strategy: z.union([z.literal('plus'), z.literal('dist')]).optional(),
    input: InputSchema.optional(),
    output: OutputSchema.optional()
}))

export type TBemPlusClassGeneratorInputConfig = z.input<typeof BemPlusClassGeneratorConfig>

export type TBemPlusClassGeneratorProjectConfig = {
    strategy: typeof defaults.strategy
    input: typeof defaults.input
    output: typeof defaults.output
}

export const parseConfig = (config: unknown): TBemPlusClassGeneratorProjectConfig[] => {
    const parsed = BemPlusClassGeneratorConfig.parse(config)

    return parsed.map((cfg) => ({
        strategy: (cfg.strategy ?? defaults.strategy) as EStrategy,
        input: {
            ...defaults.input,
            ...cfg.input,
            separators: {
                ...defaults.input.separators,
                ...cfg.input?.separators
            }
        },
        output: {
            ...defaults.output,
            ...cfg.output
        }
    }))
}
