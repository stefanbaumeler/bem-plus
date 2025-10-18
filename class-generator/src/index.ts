import {
    BemPlusClassGeneratorConfig, parseConfig,
    TBemPlusClassGeneratorInputConfig,
    TBemPlusClassGeneratorProjectConfig
} from './generator/schema'
import { BemPlusClassGenerator } from './generator/generator'
import { BemPlusClassGeneratorProject } from './BemPlusClassGeneratorProject'
import type { Compiler, Compilation } from 'webpack'

export class BemPlusClassGeneratorPlugin {
    projects: {
        project: BemPlusClassGeneratorProject
        generator: BemPlusClassGenerator
    }[]
    options: TBemPlusClassGeneratorProjectConfig[]
    constructor(options: TBemPlusClassGeneratorInputConfig) {
        this.options = parseConfig(BemPlusClassGeneratorConfig.parse(options))

        this.projects = this.options.map((cfg) => {
            return {
                project: new BemPlusClassGeneratorProject(cfg),
                generator: new BemPlusClassGenerator(cfg)
            }
        })
    }

    apply(compiler: Compiler) {
        const callback = (compilation: Compilation) => {
            this.projects.forEach((project) => {
                const changed = project.project.getChangedFiles(compilation)

                if (changed.length) {
                    project.generator.generate(compiler.outputPath)
                }
            })
        }

        compiler.hooks.afterEmit.tap('@bem-plus/class-generator plugin', callback)
    }
}
