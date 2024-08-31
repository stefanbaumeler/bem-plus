bem-plus is an attempt to standardize writing SCSS code as much as possible, so that it is not only much simpler for humans to understand and edit without introducing bugs, but also so that a machine can understand it, generate it, and generate more code based on it.

## Methodology
The [bem-plus methodology](https://github.com/stefanbaumeler/bem-plus/blob/main/methodology/readme.md), is the basis of the entire project. It, in turn, is based on [BEM](https://getbem.com/), hence the name. It includes a number of rules and strategies on how to write SCSS in a structured, scoped, scalable and easy-to-understand way.

## Packages
There are various packages that allow you to use bem-plus to its full potential.

| Package                                                                                                     | Description                                                                                       | Status           |
|-------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|------------------|
| [@bem-plus/class-generator](https://github.com/stefanbaumeler/bem-plus/blob/main/class-generator/readme.md) | Generate JavaScript or TypeScript Classes based on your bem-plus files.                           | Production ready |
| [@bem-plus/sass-generator](https://github.com/stefanbaumeler/bem-plus/blob/main/class-generator/readme.md)  | Generate the structure and all selectors of your bem-plus files automatically based on templates. | WIP              |
| [@bem-plus/autoloader](https://github.com/stefanbaumeler/bem-plus/blob/main/autoloader/readme.md)           | Automatically load JavaScript only if it is needed. (Automatic code splitting).                   | WIP              |
| [@bem-plus/linter](https://github.com/stefanbaumeler/bem-plus/blob/main/linter/readme.md)                   | Detect, report and automatically fix deviations from the bem-plus methodology.                    | Idea             |
