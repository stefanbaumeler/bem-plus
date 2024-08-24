export type TBlock = {
    name: string
    input: string
    output: string
}

export type TElement = {
    name: string
    type: string
    modifiers: string[]
}

export type TSeparators = {
    element: string
    modifier: string
    mixinElement: string
}

export type TBlockWithElements = TBlock & {
    elements: {
        [key: string]: TElement
    }
}

export type TIndex = {
    [key: string]: TBlockWithElements & {
        contents?: string
    }
}

export enum EOutputMode {
    absolute = 'absolute',
    relative = 'relative',
    node_modules = 'node_modules'
}

export enum EOutputLanguage {
    js = 'js',
    ts = 'ts'
}

export enum EStrategy {
    dist = 'dist',
    plus = 'plus'
}
