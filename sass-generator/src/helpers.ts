import fs from 'fs'

export const getFileContents = async (paths: string[]) => {
    const filePromises = paths.map((filePath) => fs.promises.readFile(filePath))
    const settled = await Promise.allSettled(filePromises)

    return settled.map((result, i) => {
        if (result.status === 'fulfilled') {
            return {
                path: paths[i],
                success: true,
                contents: result.value.toString()
            }
        }

        return {
            path: paths[i],
            success: false,
            contents: ''
        }
    })
}

export const unique = (arr: string[]) => {
    return [...new Set(arr)]
}
