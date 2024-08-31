# @bem-plus/class-generator

The `@bem-plus/class-generator` allows you to generate boilerplate JavaScript or TypeScript code from your Stylesheets.

## Requirements

`@bem-plus/class-generator` works best if used in a project that follows the bem-plus methodology. You can read more about it [here](https://github.com/stefanbaumeler/bem-plus/blob/main/methodology/readme.md).
You can also use this generator if you use only BEM, but not bem-plus. However, some of the functionality will not be available to you, see the [strategies comparison table](#strategies) below.

## Installation

```
npm i -D @bem-plus/class-generator
```
### Webpack
```typescript
const { BemPlusClassGeneratorPlugin } = require('@bem-plus/class-generator')

module.exports = {
    // ...
    plugins: [
        new BemPlusClassGeneratorPlugin({
            // config, see below
        })
    ]
}
```
## Usage

After installation and configuration, the generator works in watch and build mode. Simply write your stylesheets as you usually would and the JavaScript classes will be generated automatically.

For an example input / output, [see here](https://github.com/stefanbaumeler/bem-plus/tree/main/class-generator/example).

## Config

The entire config is optional. If an option is not specified, defaults will be used as specified below.

Recommended config:
```typescript
    new BemPlusClassGeneratorPlugin({
        strategy: 'plus',
        output: {
            onComplete: () => {
                exec('npx eslint --fix ./.bem-plus')
            }
        }
    })
```
### strategy

There are two strategies for generation: `dist` (default) and `plus` (recommended). Unlike the `dist` strategy, the `plus` strategy analyzes the uncompiled Sass code in addition to the compiled CSS.
This allows for additional features, as some information is discarded while compiling Sass to CSS.

**Note:** To use `@bem-plus/class-generator`in `plus` mode, you must follow the bem-plus methodology. That includes rules like:

- One block per file
- The file must be named like the block
- BEM element styles must be extracted into mixins
- Those "element mixins" must be named `[blockName][mixinElementSeparator][elementName]`, e.g. `header-logo`

There are more rules. You can find more information, examples and guidance [here](https://github.com/stefanbaumeler/bem-plus/blob/main/methodology/readme.md).

The following table illustrates the differences in features between the `dist` and the `plus` generator strategies:

| Feature                                                    | dist              | plus         |
|------------------------------------------------------------|-------------------|-----------------|
| Uses the compiled CSS as a basis for generation            | <center>✅</center> | <center>✅</center> |
| Uses the uncompiled Sass or SCSS as a basis for generation | <center>❌</center> | <center>✅</center> |
| Required style of CSS                                      | <center>✅</center> | <center>✅</center> |
| Generating from CSS alone                                  | <center>✅</center> | <center>❌</center> |
| Generating from Sass or SCSS                               | <center>✅</center> | <center>✅</center> |
| Generating TypeScript or JavaScript                        | <center>✅</center> | <center>✅</center> |
| Using custom separators for BEM elements and modifiers     | <center>✅</center> | <center>✅</center> |
| Including or excluding specific BEM blocks                 | <center>✅</center> | <center>✅</center> |
| Including or excluding specific files or folders           | <center>❌</center> | <center>✅</center> |
| Output generated JavaScript class relative to input file   | <center>❌</center> | <center>✅</center> |
| Empty BEM element detection                                | <center>❌</center> | <center>✅</center> |
| Including or excluding specific files or folders           | <center>❌</center> | <center>✅</center> |
| Defining return types of generated `querySelector`s        | <center>❌</center> | <center>✅</center> |

### input

The `input` part of the configuration defines options regarding the code that is used as a basis for generation.

| Option          | type       | bem-plus only | description                                                                                                                                                              |
|-----------------|------------|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `include`       | `string[]` | yes           | **Default**: `['**/*.{scss,sass}']`<br/><br/>Which files and folders the generator should search for BEM selectors when generating.                                      |
| `exclude`       | `string[]` | yes           | **Default**: `['node_modules/**']`<br/><br/>Which files and folders the generator should ignore when searching for BEM selectors.                                        |
| `excludeBlocks` | `string[]` | no            | **Default**: `[]`<br/><br/>Which BEM blocks should not be used to generate a JavaScript class. Useful especially if external libraries generate BEM or BEM-like classes. |
| `separators`    | `object`   | no            | See below table.                                                                                                                                                         |

#### separators

| Option       | type     | default | bem-plus only | description                                                                                |
|--------------|----------|---------|---------------|--------------------------------------------------------------------------------------------|
| element      | `string` | `__`    | no            | String which should separate an element from a block in a CSS selector.                    |
| modifier     | `string` | `--`    | no            | String which should separate the modifier from the rest of the selector in the input code. |
| mixinElement | `string` | `-`     | yes           | String which should separate an element from a block in the name of an element mixin.      |

### output

The `output` part of the configuration defines how the code looks like that is generated.

| Option         | type                       | bem-plus only | description                                                                                                                                            |
|----------------|----------------------------|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `language`     | `'ts' \| 'js'`             | no            | **Default**: `ts`<br/><br/>If set to `js` JavaScript code will be generated instead of TypeScript code.                                                |
| `mode`         | `'absolute' \| 'relative'` | `relative`    | **Default**: `absolute`<br/><br/>If set to `relative`, the `path` option will be understood relative to the input file.                                |
| `path`         | `string`                   | no            | **Default**: `./.bem-plus`<br/><br/>Where the generated file should be written to.                                                                     |
| `filename`     | `function`                 | no            | **Default**: ``(blockName: string, fileType: string) => `${blockName}.generated.${fileType}` ``<br/><br/>Output file name transformer function.        |
| `prefix`       | `string`                   | no            | **Default**: `''`<br/><br/>Prefix for each generated file. Useful for example for disabling eslint rules or additional imports.                        |
| `suffix`       | `string`                   | no            | **Default**: `''`<br/><br/>Suffix for each generated file. Useful for example for reenabling eslint rules.                                             |
| `elementClass` | `function`                 | no            | **Default**:  ``(elementClass) => `${elementClass}Element` ``<br/><br/>Transformer function for the name of element classes.                           |
| `moduleClass`  | `function`                 | no            | **Default**:  `(moduleClass) => moduleClass`<br/><br/>Transformer function for the name of module base classes (block classes)                         |
| `onComplete`   | `function`                 | no            | **Default**:  `() => {}`<br/><br/> Called after all files are generated. Useful for example if you want to call `eslint --fix` on the generated files. |

