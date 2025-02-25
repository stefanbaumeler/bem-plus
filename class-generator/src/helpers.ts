import fs from 'fs'

export const camel = (str: string) => {
    const addUnderlineToStart = str.startsWith('_')

    const camelOrPascal = str
        .replace(/[_-][^_\-A-Z]|(?<=[A-Z])[A-Z]/g, (m) => m.toLowerCase() === m ? m.toUpperCase() : m.toLowerCase())
        .replace(/[-_]/g, '')

    return `${addUnderlineToStart ? '_' : ''}${camelOrPascal.charAt(0).toLowerCase()}${camelOrPascal.slice(1)}`
}

export const pascal = (...strings: string[]) => {
    const camelized = camel(strings.join('-'))

    return camelized.charAt(0).toUpperCase() + camelized.slice(1)
}

export const unique = (arr: string[]) => {
    return [...new Set(arr)]
}

export const indent = (content: string, indentation: number) => {
    const lines = content.split(/\n/)

    let indentString = ''

    for (let i = 0; i < indentation; i++) {
        indentString = `    ${indentString}`
    }

    return lines.join(`\n${indentString}`)
}

export const angleType = (typeString: string, isTypeScript: boolean) => isTypeScript ? `<${typeString}>` : ''

export const colonType = (typeString: string, isTypeScript: boolean, optional?: boolean) => isTypeScript ? `${optional ? '?' : ''}: ${typeString}` : ''

export const getFileContents = async (paths: string[]) => {
    const filePromises = paths.map((filePath) => fs.promises.readFile(filePath))
    const settled = await Promise.allSettled(filePromises)

    return settled.map((result, key) => {
        if (result.status === 'fulfilled') {
            return {
                success: true,
                contents: result.value.toString(),
                filePath: paths[key]
            }
        }

        return {
            success: false,
            contents: ''
        }
    })
}
