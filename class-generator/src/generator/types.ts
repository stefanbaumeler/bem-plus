export type TSeparators = {
    element: string
    modifier: string
    mixinElement: string
}

export enum EOutputMode {
    absolute = 'absolute',
    relative = 'relative',
}

export enum EOutputLanguage {
    js = 'js',
    ts = 'ts'
}

export enum EStrategy {
    dist = 'dist',
    plus = 'plus'
}
