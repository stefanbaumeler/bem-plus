import { z } from 'zod';
export declare const BemPlusClassGeneratorConfig: z.ZodDefault<z.ZodObject<{
    strategy: z.ZodEnum<["plus", "dist"]>;
    input: z.ZodDefault<z.ZodObject<{
        include: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        exclude: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        excludeBlocks: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        separators: z.ZodDefault<z.ZodObject<{
            element: z.ZodDefault<z.ZodString>;
            modifier: z.ZodDefault<z.ZodString>;
            mixinElement: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            element: string;
            modifier: string;
            mixinElement: string;
        }, {
            element?: string | undefined;
            modifier?: string | undefined;
            mixinElement?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        include: string[];
        exclude: string[];
        excludeBlocks: string[];
        separators: {
            element: string;
            modifier: string;
            mixinElement: string;
        };
    }, {
        include?: string[] | undefined;
        exclude?: string[] | undefined;
        excludeBlocks?: string[] | undefined;
        separators?: {
            element?: string | undefined;
            modifier?: string | undefined;
            mixinElement?: string | undefined;
        } | undefined;
    }>>;
    output: z.ZodDefault<z.ZodObject<{
        autoloader: z.ZodDefault<z.ZodBoolean>;
        language: z.ZodDefault<z.ZodEnum<["js", "ts"]>>;
        mode: z.ZodDefault<z.ZodEnum<["relative", "absolute"]>>;
        path: z.ZodDefault<z.ZodString>;
        filename: z.ZodDefault<z.ZodFunction<z.ZodTuple<[z.ZodString, z.ZodString], z.ZodUnknown>, z.ZodString>>;
        prefix: z.ZodDefault<z.ZodString>;
        suffix: z.ZodDefault<z.ZodString>;
        elementClass: z.ZodDefault<z.ZodFunction<z.ZodTuple<[z.ZodString], z.ZodUnknown>, z.ZodString>>;
        moduleClass: z.ZodDefault<z.ZodFunction<z.ZodTuple<[z.ZodString], z.ZodUnknown>, z.ZodString>>;
        onComplete: z.ZodDefault<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        filename: (args_0: string, args_1: string, ...args_2: unknown[]) => string;
        path: string;
        prefix: string;
        language: "js" | "ts";
        autoloader: boolean;
        mode: "absolute" | "relative";
        suffix: string;
        elementClass: (args_0: string, ...args_1: unknown[]) => string;
        moduleClass: (args_0: string, ...args_1: unknown[]) => string;
        onComplete: (...args: unknown[]) => unknown;
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
    input: {
        include: string[];
        exclude: string[];
        excludeBlocks: string[];
        separators: {
            element: string;
            modifier: string;
            mixinElement: string;
        };
    };
    output: {
        filename: (args_0: string, args_1: string, ...args_2: unknown[]) => string;
        path: string;
        prefix: string;
        language: "js" | "ts";
        autoloader: boolean;
        mode: "absolute" | "relative";
        suffix: string;
        elementClass: (args_0: string, ...args_1: unknown[]) => string;
        moduleClass: (args_0: string, ...args_1: unknown[]) => string;
        onComplete: (...args: unknown[]) => unknown;
    };
    strategy: "dist" | "plus";
}, {
    strategy: "dist" | "plus";
    input?: {
        include?: string[] | undefined;
        exclude?: string[] | undefined;
        excludeBlocks?: string[] | undefined;
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
}>>;
export type TBemPlusClassGeneratorConfigInput = z.input<typeof BemPlusClassGeneratorConfig>;
export type TBemPlusClassGeneratorConfigOutput = z.output<typeof BemPlusClassGeneratorConfig>;
