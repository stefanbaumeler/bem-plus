import { angleType } from '../../helpers'

export const rootReferenceTemplate = ({
    type,
    isTypeScript,
    className
}: {
    type: string
    isTypeScript: boolean
    className: string
}) => `this.root = new ${className}RootElement(${angleType(type, isTypeScript)}rootElement)`
