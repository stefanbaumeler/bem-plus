import { angleType } from '../../helpers'

export const rootReferenceTemplate = ({
    isTypeScript,
    className
}: {
    isTypeScript: boolean
    className: string
}) => `this.root = new ${className}RootElement(${angleType('HTMLElement', isTypeScript)}rootElement)`
