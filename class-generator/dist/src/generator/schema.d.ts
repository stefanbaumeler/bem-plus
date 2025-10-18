import { z } from 'zod';
import { EStrategy } from './types';
declare const defaults: {
    strategy: EStrategy;
    input: {
        include: string[];
        exclude: string[];
        excludeBlocks: string[];
        rootMixinSuffix: string;
        separators: {
            element: string;
            modifier: string;
            mixinElement: string;
        };
    };
    output: {
        autoloader: boolean;
        language: "ts" | "js";
        mode: "relative" | "absolute";
        path: string;
        filename: (blockName: string, fileType: string) => string;
        prefix: string;
        suffix: string;
        elementClass: (elementName: string) => string;
        moduleClass: (moduleClass: string) => string;
        onComplete: () => void;
    };
};
export declare const BemPlusClassGeneratorConfig: z.ZodArray<z.ZodObject<{
    strategy: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"plus">, z.ZodLiteral<"dist">]>>;
    input: z.ZodOptional<z.ZodObject<{
        include: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        exclude: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        excludeBlocks: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        rootMixinSuffix: z.ZodOptional<z.ZodString>;
        separators: z.ZodOptional<z.ZodObject<{
            element: z.ZodOptional<z.ZodString>;
            modifier: z.ZodOptional<z.ZodString>;
            mixinElement: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            element?: string | undefined;
            modifier?: string | undefined;
            mixinElement?: string | undefined;
        }, {
            element?: string | undefined;
            modifier?: string | undefined;
            mixinElement?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        include?: string[] | undefined;
        exclude?: string[] | undefined;
        excludeBlocks?: string[] | undefined;
        rootMixinSuffix?: string | undefined;
        separators?: {
            element?: string | undefined;
            modifier?: string | undefined;
            mixinElement?: string | undefined;
        } | undefined;
    }, {
        include?: string[] | undefined;
        exclude?: string[] | undefined;
        excludeBlocks?: string[] | undefined;
        rootMixinSuffix?: string | undefined;
        separators?: {
            element?: string | undefined;
            modifier?: string | undefined;
            mixinElement?: string | undefined;
        } | undefined;
    }>>;
    output: z.ZodOptional<z.ZodObject<{
        autoloader: z.ZodOptional<z.ZodBoolean>;
        language: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"js">, z.ZodLiteral<"ts">]>>;
        mode: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"relative">, z.ZodLiteral<"absolute">]>>;
        path: z.ZodOptional<z.ZodString>;
        filename: z.ZodOptional<z.ZodFunction<z.ZodTuple<[z.ZodString, z.ZodString], z.ZodUnknown>, z.ZodString>>;
        prefix: z.ZodOptional<z.ZodString>;
        suffix: z.ZodOptional<z.ZodString>;
        elementClass: z.ZodOptional<z.ZodFunction<z.ZodTuple<[z.ZodString], z.ZodUnknown>, z.ZodString>>;
        moduleClass: z.ZodOptional<z.ZodFunction<z.ZodTuple<[z.ZodString], z.ZodUnknown>, z.ZodString>>;
        onComplete: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        filename?: ((args_0: string, args_1: string, ...args_2: unknown[]) => string) | undefined;
        path?: string | undefined;
        prefix?: string | undefined;
        language?: "js" | "ts" | undefined;
        autoloader?: boolean | undefined;
        mode?: "absolute" | "relative" | undefined;
        suffix?: string | undefined;
        elementClass?: ((args_0: string, ...args_1: unknown[]) => string) | undefined;
        moduleClass?: ((args_0: string, ...args_1: unknown[]) => string) | undefined;
        onComplete?: ((...args: unknown[]) => unknown) | undefined;
    }, {
        filename?: ((args_0: string, args_1: string, ...args_2: unknown[]) => string) | undefined;
        path?: string | undefined;
        prefix?: string | undefined;
        language?: "js" | "ts" | undefined;
        autoloader?: boolean | undefined;
        mode?: "absolute" | "relative" | undefined;
        suffix?: string | undefined;
        elementClass?: ((args_0: string, ...args_1: unknown[]) => string) | undefined;
        moduleClass?: ((args_0: string, ...args_1: unknown[]) => string) | undefined;
        onComplete?: ((...args: unknown[]) => unknown) | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    input?: {
        include?: string[] | undefined;
        exclude?: string[] | undefined;
        excludeBlocks?: string[] | undefined;
        rootMixinSuffix?: string | undefined;
        separators?: {
            element?: string | undefined;
            modifier?: string | undefined;
            mixinElement?: string | undefined;
        } | undefined;
    } | undefined;
    output?: {
        filename?: ((args_0: string, args_1: string, ...args_2: unknown[]) => string) | undefined;
        path?: string | undefined;
        prefix?: string | undefined;
        language?: "js" | "ts" | undefined;
        autoloader?: boolean | undefined;
        mode?: "absolute" | "relative" | undefined;
        suffix?: string | undefined;
        elementClass?: ((args_0: string, ...args_1: unknown[]) => string) | undefined;
        moduleClass?: ((args_0: string, ...args_1: unknown[]) => string) | undefined;
        onComplete?: ((...args: unknown[]) => unknown) | undefined;
    } | undefined;
    strategy?: "dist" | "plus" | undefined;
}, {
    input?: {
        include?: string[] | undefined;
        exclude?: string[] | undefined;
        excludeBlocks?: string[] | undefined;
        rootMixinSuffix?: string | undefined;
        separators?: {
            element?: string | undefined;
            modifier?: string | undefined;
            mixinElement?: string | undefined;
        } | undefined;
    } | undefined;
    output?: {
        filename?: ((args_0: string, args_1: string, ...args_2: unknown[]) => string) | undefined;
        path?: string | undefined;
        prefix?: string | undefined;
        language?: "js" | "ts" | undefined;
        autoloader?: boolean | undefined;
        mode?: "absolute" | "relative" | undefined;
        suffix?: string | undefined;
        elementClass?: ((args_0: string, ...args_1: unknown[]) => string) | undefined;
        moduleClass?: ((args_0: string, ...args_1: unknown[]) => string) | undefined;
        onComplete?: ((...args: unknown[]) => unknown) | undefined;
    } | undefined;
    strategy?: "dist" | "plus" | undefined;
}>, "many">;
export type TBemPlusClassGeneratorInputConfig = z.input<typeof BemPlusClassGeneratorConfig>;
export type TBemPlusClassGeneratorProjectConfig = {
    strategy: typeof defaults.strategy;
    input: typeof defaults.input;
    output: typeof defaults.output;
};
export declare const parseConfig: (config: unknown) => TBemPlusClassGeneratorProjectConfig[];
export {};
