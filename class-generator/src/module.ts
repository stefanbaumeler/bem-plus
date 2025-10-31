export class BemPlusModule<TRoot extends HTMLElement = HTMLElement> {
    static selector: string

    refresh = () => {
    }

    constructor (rootElement: TRoot, ...dependencies: (BemPlusModule | BemPlusModule[] | undefined)[]) {
        new MutationObserver(() => {
            this.refresh()
        }).observe(rootElement, {
            childList: true,
            subtree: true
        })
    }
}

type Constructor<T> = new (...args: never[]) => T

class Dependencies {
    private factories = new Map<Constructor<unknown> | Constructor<unknown>[], () => unknown>()

    register<T>(token: Constructor<T> | Constructor<T>[], factory: () => T | T[]) {
        this.factories.set(token, factory)
    }

    resolve<T>(token: Constructor<T> | Constructor<T>[]) {
        const factory = this.factories.get(token)

        if (!factory) {
            throw new Error(`No provider for ${token.toString()}`)
        }

        return factory() as T | T[]
    }
}

export const modules: {
    selector: string
    module: BemPlusModule
}[] = []

export const dependencyContainer = new Dependencies()

export const addModule = <
    TModule extends typeof BemPlusModule,
    TDependency extends {
        new (rootEl: HTMLElement): BemPlusModule
        selector: string
    } | {
        new (rootEl: HTMLElement): BemPlusModule
        selector: string
    }[]> (ModuleClass: TModule, dependencies: TDependency[] = []) => {
    onDocumentReady(() => {
        const els = document.querySelectorAll<HTMLElement>(ModuleClass.selector)

        els.forEach((el) => {
            dependencies.forEach((Dependency) => {
                if (el) {
                    dependencyContainer.register(Dependency, () => {
                        if (Array.isArray(Dependency)) {
                            const roots = [...el.querySelectorAll<HTMLElement>(Dependency[0].selector)]

                            return roots.map((dependencyRoot) => new Dependency[0](dependencyRoot))
                        }

                        const root = el.querySelector<HTMLElement>(Dependency.selector)

                        if (root) {
                            return new Dependency(root)
                        }
                    })
                }
            })

            const resolvedDependencies = dependencies.map((dep) => dependencyContainer.resolve(dep))

            modules.push({
                selector: ModuleClass.selector,
                module: new ModuleClass(el, ...resolvedDependencies)
            })
        })
    })
}

export const onDocumentReady = (callback: () => void) => {
    if (document.readyState === 'interactive') {
        callback()
    } else {
        document.addEventListener('DOMContentLoaded', callback)
    }
}
