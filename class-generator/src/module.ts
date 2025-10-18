export class BemPlusModule<TRoot extends Element | HTMLElement = HTMLElement> {
    type

    rootClass

    index = 0

    refresh = () => {
    }

    constructor (rootElement: TRoot, k?: number) {
        if (k) {
            this.index = k
        }

        this.type = this.constructor.name

        this.rootClass = rootElement.classList[0]?.split('__')[0]

        new MutationObserver(() => {
            this.refresh()
        }).observe(rootElement, {
            childList: true,
            subtree: true
        })
    }
}
