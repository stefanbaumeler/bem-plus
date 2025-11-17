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

By default, the generated elements methods will use `querySelectorAll` and return `HTMLElement[]`.

#### Automatic type inference from templates

Using `input.templates` in your config, you can define where the templates are that use the bem-plus blocks you defined in your scss. The class generator will statically analyze those templates to infere which types should be used when generating querySelectors. For example, if you have a bem-plus block "slider" with a bem-plus element "button", and you have a template that includes something like this:

```html
<button class="slider__button">My button</button>
```

The class generator will generate the SliderButtonElement with type `HTMLButtonElement`.

##### Caveats

The class generator is not able to detect the correct type for generated elements and will fall back to `HTMLElement` in the following situations:

- Root elements of blocks
- Custom HTML tags (e.g. React, web components)
- Dynamic classes / string interpolation

Automatic type inference should work for most templating languages, but is only explicitly supported for Razor templates and plain HTML. If


#### Manual override

You can also add the `$type` parameter to your element mixin, which will override the default and automatic behaviors. In addition, you can pass `$single: true` to change the type to a single instance of the type you defined or the automatically generated type.

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

The class generator does not aim to provide features like traversing the DOM tree, finding child elements and such. It does not aim to become jQuery. While it is encouraged to use the available element classes, it is still very common to stray from them and use querySelectors for simplicity. One downside of this, is that you have to pass a string to the querySelectors, which is prone to typos.

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

### `addModule`

The class generator generates classes you can use as a basis of your own classes. Once you have written such a class, you have to initialize it for each component on your website that corresponds to this BEM block. You will notice that this initialization process is always the same: Let's say you have a block "teaser-list". You have to loop all occurrences of `.teaser-list` on the page and initialize the `TeaserList` class with that element as its root element. You also have to make sure this only happens after the document is ready. This can quickly become a nuisance because you have to do this for each and every component. This is why `addModule` is part of the class generator. It does this for you. Simply write this:

```typescript
import { addModule } from '@bem-plus/class-generator'
import { TeaserList } from './teaser-list.ts'

addModule(TeaserList)
```

This will create an instance of `TeaserList` for each occurrence of `.teaser-list` on your page, including its elements and modifiers.

#### Dependency Injection

`addModule` takes a second argument, an array where you can reference other modules. Those references will be injected into the module you are adding. Let's say your teaser-list is filterable. You'd have one `filter` block per filter, and you'd want to initialize them from your `TeaserList` class. With dependency injection, this is simple. First, when adding the module, reference `Filters` in `addModule`:

```typescript
addModule(TeaserList, [Filter])
```

now in your `TeaserList` class you can inject the `Filter` instances:

```typescript
export class TeaserList extends TeaserListBase {
    // Inject the filters in the constructor
    constructor(rootEl: HTMLElement, public filter: Filter) {
        super(rootEl)

        // this.filters will contain all instances of Filter inside this instance of TeaserList.
        // Do whatever you want with the Filter instances
        this.filters.forEach((filter) => {
            filter.root.active = true
            filter.onChange = this.onFiltersChanged
        })
    }

    onFiltersChanged = (filter: Filter) => {
        // For example you could change whether an item is visible based on the active filter
        this.item.forEach((item) => {
            item.active = item.el.dataset.category === filter.input.value
        })
    }
}
```

This takes the first instance of "filter" inside each "teaser-list" instance and injects it. But what if you want to inject multiple instances of "filter" that exist inside "teaser-list"? You have to let `addModule` know that you want to inject multiple. You can do this by wrapping `Filter` into an extra set of brackets:

```typescript
addModule(TeaserList, [[Filter]])
```

Inside TeaserList, you have to update the constructor:

```typescript
export class TeaserList extends TeaserListBase {
    constructor(rootEl: HTMLElement, public filters: Filter[]) {
        super(rootEl)

        // ...
    }
}
```

Now you have access to all instances of "filter" inside TeaserList. It's the same difference as with `$single: true`.

You can also inject multiple modules into another module:

```typescript
addModule(TeaserList, [[Filter], [Tooltip], Whatever])
```

Note that the order of the injected modules must match the way you access them in your constructor:

```typescript
export class TeaserList extends TeaserListBase {
    constructor(rootEl: HTMLElement, public filters: Filter[], public tooltips: Tooltip[], public whatever?: Whatever) {
        super(rootEl)

        // ...
    }
}
```


## Config

The class generator has an extensive configuration, making it usable for many different setups.
The entire config is optional. If an option is not specified, defaults will be used as specified below.

### Recommended config

```typescript
new BemPlusClassGeneratorPlugin([{
    strategy: 'plus',
    output: {
        onComplete: () => {
            exec('npx eslint --fix ./.bem-plus')
        }
    }
}])
```

### Minimal config

```typescript
new BemPlusClassGeneratorPlugin()
```

### Multi-config

In certain situations, like in a monorepo, it is possible to have multiple projects, but only one bundling setup. In this setup, it is possible that you have, for example, a `button.scss` in two different projects, that have nothing to do with each other. By default, the class generator will assume that this is the same BEM block and thus create one class with the elements of both `button.scss`. To avoid this, you have to tell the class generator that you have multiple projects with separate root directories. To do so, you can pass multiple configurations to the class generator:

```typescript
new BemPlusClassGeneratorPlugin([
    {
        input: {
            include: ['./project-one/**/*.scss'],
        }
    },
    {
        input: {
            include: ['./project-two/**/*.scss'],
        }
    }
])
```

Or shorter:

```typescript
new BemPlusClassGeneratorPlugin(['./project-one', './project-two'].map((layoutPath) => ({
    input: {
        include: [`${layoutPath}/**/*.scss`],
    }
})))
```

You can pass as many configurations for as many projects as you wish. You can not only define which files are included per project here, you can pass entirely different configurations per projects if you wish.

### strategy

There are two strategies for generation: `dist` (default) and `plus` (recommended). While the `dist` strategy uses the compiled CSS to generate the JS classes, the `dist` strategy instead analyzes the uncompiled SCSS code.    This allows for additional features, as some information is discarded while compiling SCSS to CSS and greatly improves performance.

**Note:** To use `@bem-plus/class-generator`in `plus` mode, you must follow the bem-plus methodology. That includes rules like:

- One block per file
- The file must be named like the block
- BEM element styles must be extracted into mixins
- Those "element mixins" must be named in a consistent manner.

There are more rules. You can find more information, examples and guidance [here](https://github.com/stefanbaumeler/bem-plus/blob/main/methodology/readme.md).

The following table illustrates the differences in features between the `dist` and the `plus` generator strategies:

| Feature                                                                     | dist | plus |
|-----------------------------------------------------------------------------|:----:|:----:|
| Uses the compiled CSS as a basis for generation                             |  ✅   |  ❌   |
| Uses the uncompiled SCSS as a basis for generation                          |  ❌   |  ✅   |
| Required style of CSS                                                       |  ✅   |  ✅   |
| Generating TypeScript or JavaScript                                         |  ✅   |  ✅   |
| Using custom separators for BEM elements and modifiers                      |  ✅   |  ✅   |
| Including or excluding specific BEM blocks                                  |  ✅   |  ✅   |
| Including or excluding specific files or folders                            |  ❌   |  ✅   |
| Output generated JavaScript class relative to input file                    |  ❌   |  ✅   |
| Empty BEM element detection                                                 |  ❌   |  ✅   |
| BEM element detection in templates.                                         |  ❌   |  ✅   |
| Defining return types of generated `querySelector`s                         |  ❌   |  ✅   |
| Automatically infer types of generated  `querySelector`s based on templates |  ❌   |  ✅   |
| Passing variables from SCSS to JS                                           |  ❌   |  ✅   |

### input

The `input` part of the configuration defines options regarding the code that is used as a basis for generation.

| Option            | type       | bem-plus only | description                                                                                                                                                                                                            |
|-------------------|------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `include`         | `string[]` | yes           | **Default**: `['**/*.{scss,sass}']`<br/><br/>Which files and folders the generator should search for BEM selectors when generating.                                                                                    |
| `exclude`         | `string[]` | yes           | **Default**: `['node_modules/**']`<br/><br/>Which files and folders the generator should ignore when searching for BEM selectors.                                                                                      |
| `templates`       | `string[]` | yes           | **Default**: `[]`<br/><br/>Where to find templates that use the bem-plus css classes. The templates are used to infer types and additional elements you may not have defined in your CSS code.                         |
| `excludeBlocks`   | `string[]` | no            | **Default**: `[]`<br/><br/>Which BEM blocks should not be used to generate a JavaScript class. Useful especially if external libraries generate BEM or BEM-like classes.                                               |
| `rootMixinSuffix` | `string`   | yes           | **Default**: `root`<br/><br/> The mixin for a root element of a block must be suffixed so it does not conflict with the blocks index mixin, e.g. `@mixin block-root`. This option lets you choose what suffix is used. |
| `separators`      | `object`   | no            | See below table.                                                                                                                                                                                                       |

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

