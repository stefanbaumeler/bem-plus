import path from 'path'
import fs from 'fs'
import { glob } from 'glob'
import { TBemPlusClassGeneratorProjectConfig } from '../schema'
import type { Compilation } from 'webpack'

export class Project {
    prevTimestamps = new Map<string, number>()
    constructor (public config: TBemPlusClassGeneratorProjectConfig) {
    }
    getChangedFiles = (compilation: Compilation) => {
        const changedFiles: string[] = []
        const watchedFiles = new Set()

        for (const pattern of this.config.input.include) {
            const matches = glob.sync(pattern, {
                absolute: true
            })

            matches.forEach((f) => watchedFiles.add(path.resolve(f)))
        }

        if (compilation.fileDependencies) {
            for (const file of compilation.fileDependencies) {
                if (!watchedFiles.has(path.resolve(file))) {
                    continue
                }

                const prevTime = this.prevTimestamps.get(file)
                const stat = fs.existsSync(file) ? fs.statSync(file) : null
                const mtime = stat ? stat.mtimeMs : Infinity

                this.prevTimestamps.set(file, mtime)

                if (!prevTime || prevTime < mtime) {
                    changedFiles.push(file)
                }
            }
        }

        return changedFiles
    }
}
