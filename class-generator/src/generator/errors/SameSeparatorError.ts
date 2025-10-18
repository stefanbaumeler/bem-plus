import { PACKAGE_NAME } from '../const'

export class SameSeparatorError extends Error {
    constructor () {
        super(`${PACKAGE_NAME}: Cannot use the same separator for elements and modifiers`)
        this.name = 'SameSeparatorError'
    }
}
