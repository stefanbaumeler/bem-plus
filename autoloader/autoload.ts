// import { pascal } from '../helpers'
// import * as path from 'node:path'
//
// const modules: { selector: string, module: any }[] = []
// const onModulesLoadedCallbacks: (() => any)[] = []
// let modulesLoaded = false
//
// export const onModulesLoaded = (callback?: () => any) => {
//     if (modulesLoaded && callback) {
//         callback()
//         return
//     }
//
//     if (callback) {
//         onModulesLoadedCallbacks.push(callback)
//
//         return
//     }
//
//     modulesLoaded = true
//     onModulesLoadedCallbacks.forEach((cb) => {
//         cb()
//     })
// }
//
// export const addModule = (selector: string, p: string) => new Promise((resolve) => {
//     const els = document.querySelectorAll(selector)
//
//     if (els.length) {
//         import(path.resolve('/', p)).then((module) => {
//             const constructorName = pascal(p.split('/')
//                 .slice(-1)[0])
//             const ModuleConstructor = module.default ? module.default : module[constructorName]
//
//             els.forEach((el) => {
//                 try {
//                     const mod = new ModuleConstructor(<HTMLElement>el)
//
//                     modules.push({
//                         selector,
//                         module: mod,
//                     })
//                     resolve(true)
//                 } catch (err) {
//                     /* eslint-disable-next-line */
//                     console.error(err);
//                 } finally {
//                     resolve(false)
//                 }
//             })
//         })
//     } else {
//         resolve(false)
//     }
// })
//
// const getModulesOfType = <T extends Module>(ofClass: new(rootElement: Element) => T): Promise<T[]> => (
//     new Promise((resolve) => {
//         onModulesLoaded(() => {
//             resolve((modules
//                 .filter((module) => module.module instanceof ofClass)
//                 .map((module) => module.module)) as unknown as T[])
//         })
//     }))
//
// export const createApp = () => {
//     document.addEventListener('DOMContentLoaded', () => {
//         Promise.all(Object.keys(moduleBases).map((module) => addModule(module, moduleBases[module]))).then(() => {
//             onModulesLoaded()
//         })
//     })
// }
