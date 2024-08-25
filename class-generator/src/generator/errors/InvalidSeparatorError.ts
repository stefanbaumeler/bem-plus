import { PACKAGE_NAME } from '../const'

export class InvalidSeparatorError extends Error {
    constructor(separator: string, separatorType: string) {
        super(`${PACKAGE_NAME}: ${separator.length ? `${separatorType} cannot be separated by "${separator}".` : `${separatorType} must be separated by at least one character.`}`)
        this.name = 'InvalidSeparatorError'
    }
}
