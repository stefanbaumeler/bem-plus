export declare class InvalidModifierError extends Error {
    constructor({ file, selector, modifier }: {
        file?: string;
        modifier: string;
        selector?: string;
    });
}
