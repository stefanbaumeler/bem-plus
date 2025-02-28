# @bem-plus/class-generator

The `@bem-plus/class-generator` allows you to generate boilerplate JavaScript or TypeScript code from your Stylesheets.

## Requirements

`@bem-plus/class-generator` works best if used in a project that follows the bem-plus methodology. You can read more about it [here](https://github.com/stefanbaumeler/bem-plus/blob/main/methodology/readme.md).
You can also use this generator if you use only BEM, but not bem-plus. However, some of the functionality will not be available to you, see the [strategies comparison table](#strategies) below.

## Installation

```
npm i -D @bem-plus/class-generator
```
### Webpack / rspack
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

After installation and configuration, the generator works in watch and build mode. Simply write your stylesheets as you usually would and the JavaScript classes will be generated automatically in the directory you specified in your config.

For an example input / output, [see here](https://github.com/stefanbaumeler/bem-plus/tree/main/class-generator/example).

## Features

### Using the generated classes

Given this scss:
```scss
@mixin main-nav-root {
    // some css
}

@mixin main-nav-link {
    // some css

    &--active {
        // some active state css
    }
}

@mixin main-nav {
    .main-nav {
        @include main-nav-root;

        &__link {
            @include main-nav-link;
        }
    }
}
```

The class generator will generate a JavaScript or TypeScript class (depending on your config), which you can then extend in your own code:

```js
// The import path will depend on your config
import { MainNavBase, MainNavLinkElement } from '@/.bem-plus'

class MainNav extends MainNavBase {
    constructor(rootEl: HTMLElement) {
        super(rootEl)

        // this.link is equivalent to:
        // rootEl.querySelectorAll('.main-nav__link')
        this.link.forEach((link) => {

            // use .el to access the underlying element.
            link.el.addEventListener('click', () => this.onClick(link))
        })
    }

    // You can use the type of any bem element by importing it
    onClick(link: MainNavLinkElement) {

        // link has direct access and autocomplete for all its modifiers.
        // setting link.acive here is equal to:
        // link.classList.add('main-nav__link--active')
        link.active = true
    }
}

// Instantiate with a root element
const nav = new MainNav(document.querySelector('.main-nav'));
```

### Typing the generated elements (`plus` strategy only)

By default, the generated elements methods will use `querySelectorAll` and return `HTMLElement[]`. You can modify this behavior by passing arguments to the element mixin:

```scss
@mixin main-nav-logo($single: true, $type: HTMLImageElement) {
    // some css
}
```
```ts
// Without passing those arguments, you'd have to write this:
const before = (this.logo[0]?.el as HTMLImageElement).src

// Because of $single: true, this.logo no longer returns an array and can access .el directly.
// Because of $type: HTMLImageElement "src" is available.
const after = this.logo?.el.src
```

### Passing additional variables (`plus` strategy only)

In addition to `$single` and `$type` you can pass any other value to JS. This can be useful for example when you have to wait for a transition to complete before taking some action in JS:

```scss
@mixin main-nav-animation($duration: 250) {
    transition: opacity #{$duration}ms;
    opacity: 0;

    &--active {
        opacity: 1;
    }
}
```

```ts
this.animation.active = false;

setTimeout(() => {
    // this will be executed after 250ms, once the CSS transition of opacity is complete.
}, this.animation.$duration)
```
Currently only numbers and strings can be passed. If passing strings, make sure you wrap it in quotes (" or ' are fine).

### querySelectors without typos

The class-generator does not aim to provide features like traversing the DOM tree, finding child elements and such. It does not aim to become jQuery. While it is encouraged to use the available element classes, it is still very common to stray from them and use querySelectors for simplicity. One downside of this, is that you have to pass a string to the querySelectors, which is prone to typos.

To avoid these, the generated element classes expose their selector as a static property. This property can act as an "enum". Use it to avoid having to write querySelectors with string selectors:

```ts
import { MainNavLinkElement } from '@/.bem-plus'

// before
const links = document.querySelectorAll('.main-nav__link')
const activeLinks = document.querySelectorAll('.main-nav__link--active')

activeLinks.forEach((activeLink) => {
    activeLink.classList.remove('main-nav__link--activ') // <= Look, a typo!
})

// after
const links = document.querySelectorAll(MainNavLinkElement.el);
const activeLinks = document.querySelectorAll(MainNavLinkElement.active);

activeLinks.forEach((activeLink) => {
    // .substring(1) removes the '.' at the start
    activeLink.classList.remove(MainNavLinkElement.active.substring(1)) // <= Doesn't happen here!
})

```


## Config

The class generator has an extensive configuration, making it usable for many different setups.
The entire config is optional. If an option is not specified, defaults will be used as specified below.

### Recommended config:

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

### Minimal config:

```typescript
new BemPlusClassGeneratorPlugin()
```

### strategy

There are two strategies for generation: `dist` (default) and `plus` (recommended). While the `dist` strategy uses the compiled CSS to generate the JS classes, the `dist` strategy instead analyzes the uncompiled SCSS code.  This allows for additional features, as some information is discarded while compiling SCSS to CSS and greatly improves performance.

**Note:** To use `@bem-plus/class-generator`in `plus` mode, you must follow the bem-plus methodology. That includes rules like:

- One block per file
- The file must be named like the block
- BEM element styles must be extracted into mixins
- Those "element mixins" must be named in a consistent manner.

There are more rules. You can find more information, examples and guidance [here](https://github.com/stefanbaumeler/bem-plus/blob/main/methodology/readme.md).

The following table illustrates the differences in features between the `dist` and the `plus` generator strategies:

| Feature                                                  | dist              | plus         |
|----------------------------------------------------------|-------------------|-----------------|
| Uses the compiled CSS as a basis for generation          | <center>✅</center> | <center>❌</center> |
| Uses the uncompiled SCSS as a basis for generation       | <center>❌</center> | <center>✅</center> |
| Required style of CSS                                    | <center>✅</center> | <center>✅</center> |
| Generating TypeScript or JavaScript                      | <center>✅</center> | <center>✅</center> |
| Using custom separators for BEM elements and modifiers   | <center>✅</center> | <center>✅</center> |
| Including or excluding specific BEM blocks               | <center>✅</center> | <center>✅</center> |
| Including or excluding specific files or folders         | <center>❌</center> | <center>✅</center> |
| Output generated JavaScript class relative to input file | <center>❌</center> | <center>✅</center> |
| Empty BEM element detection                              | <center>❌</center> | <center>✅</center> |
| Defining return types of generated `querySelector`s      | <center>❌</center> | <center>✅</center> |
| Passing variables from SCSS to JS                        | <center>❌</center> | <center>✅</center> |

### input

The `input` part of the configuration defines options regarding the code that is used as a basis for generation.

| Option            | type       | bem-plus only | description                                                                                                                                                                                                           |
|-------------------|------------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `include`         | `string[]` | yes           | **Default**: `['**/*.{scss,sass}']`<br/><br/>Which files and folders the generator should search for BEM selectors when generating.                                                                                   |
| `exclude`         | `string[]` | yes           | **Default**: `['node_modules/**']`<br/><br/>Which files and folders the generator should ignore when searching for BEM selectors.                                                                                     |
| `excludeBlocks`   | `string[]` | no            | **Default**: `[]`<br/><br/>Which BEM blocks should not be used to generate a JavaScript class. Useful especially if external libraries generate BEM or BEM-like classes.                                              |
| `rootMixinSuffix` | `string`   | yes           | **Default**: `root`<br/><br/> The mixin for a root element of a block must be suffixed so it does not conflict with the blocks index mixin, e.g. `@mixin block-root`. This option lets you choose what suffix is used. |
| `separators`      | `object`   | no            | See below table.                                                                                                                                                                                                      |

#### separators

| Option       | type     | default | bem-plus only | description                                                                                |
|--------------|----------|---------|---------------|--------------------------------------------------------------------------------------------|
| `element`      | `string` | `__`    | no            | String which should separate an element from a block in a CSS selector.                    |
| `modifier`     | `string` | `--`    | no            | String which should separate the modifier from the rest of the selector in the input code. |
| `mixinElement` | `string` | `-`     | yes           | String which should separate an element from a block in the name of an element mixin.      |

### output

The `output` part of the configuration defines how the code looks like that is generated.

| Option         | type                       | bem-plus only | description                                                                                                                                                                         |
|----------------|----------------------------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `language`     | `'ts' \| 'js'`             | no            | **Default**: `ts`<br/><br/>If set to `js` JavaScript code will be generated instead of TypeScript code.                                                                             |
| `mode`         | `'absolute' \| 'relative'` | `relative`    | **Default**: `absolute`<br/><br/>If set to `relative`, the `path` option will be understood relative to the input file.                                                             |
| `path`         | `string`                   | no            | **Default**: `./.bem-plus`<br/><br/>Where the generated file should be written to.                                                                                                  |
| `filename`     | `function`                 | no            | **Default**: ``(blockName: string, fileType: string) => `${blockName}.generated.${fileType}` ``<br/><br/>Output file name transformer function.                                     |
| `prefix`       | `string`                   | no            | **Default**: `''`<br/><br/>Prefix for each generated file. Useful for example for disabling eslint rules or additional imports.                                                     |
| `suffix`       | `string`                   | no            | **Default**: `''`<br/><br/>Suffix for each generated file. Useful for example for reenabling eslint rules.                                                                          |
| `elementClass` | `function`                 | no            | **Default**:  ``(elementClass) => `${elementClass}Element` ``<br/><br/>Transformer function for the name of element classes.                                                        |
| `moduleClass`  | `function`                 | no            | **Default**:  `(moduleClass) => moduleClass`<br/><br/>Transformer function for the name of module base classes (block classes)                                                      |
| `onComplete`   | `function`                 | no            | **Default**:  `() => {}`<br/><br/> Called after all files are generated. Useful for example if you want to call `eslint --fix` on the generated files.                              |
| `autoloader`   | `boolean`                  | no            | **Default**:  `false`<br/><br/> The class generator can generate a "block name to module path" map, which can be useful when conditionally importing modules (code splitting etc.). |

