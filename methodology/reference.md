## Levels of rules

| Icon | Level       | Rule                                                                                                                   |
|------|-------------|------------------------------------------------------------------------------------------------------------------------|
| 🔴   | Required    | Rules that are an essential part of bem-plus. They must be followed, or some of the packages might not work correctly. |
| 🟡   | Recommended | Rules that help reduce bugs, or are otherwise deemed important, but not strictly required.                             |
| 🔵   | Convention  | Rules that help you structure your code the same throughout your application.                                          |

## 1. General Rules

| #   | Lvl                 | Rule                                                                                                                  | Example | Explanation |
|-----|---------------------|-----------------------------------------------------------------------------------------------------------------------|---------|-------------|
| 101 | <center>🟡</center> | Utility classes should not be used. Use utility mixins instead.                                                       | Example | Explanation |
| 102 | <center>🟡</center> | % / @extend should not be used. Use utility mixins instead.                                                           | Example | Explanation |
| 103 | <center>🟡</center> | All `@at-root` selectors should end with `&`.                                                                         | Example | Explanation |
| 104 | <center>🟡</center> | Keep your code DRY, but do not link things that you wouldn't want to change together. When in doubt, repeat yourself. | Example | Explanation |
| 105 | <center>🔵</center> | Utility mixins should not contain selectors or media queries. Instead, create multiple utility mixins.                | Example | Explanation |
| 106 | <center>🔵</center> | Utility mixins can include other utility mixins, but do not go beyond 3 layers.                                       | Example | Explanation |

## 2. File system and overall structure

| #   | Lvl                 | Rule                                                                                                                 | Example | Explanation |
|-----|---------------------|----------------------------------------------------------------------------------------------------------------------|---------|-------------|
| 201 | <center>🔴</center> | Styles must be kept in stylesheets, separate from templates and JavaScript code (no Vue SFCs for example).           | Example | Explanation |
| 202 | <center>🔴</center> | There must only ever be one block per Stylesheet.                                                                    | Example | Explanation |
| 203 | <center>🔴</center> | The file must be named the same as the block. A leading `_` is okay.                                                 | Example | Explanation |
| 204 | <center>🔵</center> | Stylesheets should be stored in a dedicated directory (e.g. `/src/styles`), not together with other component files. | Example | Explanation |

## 3. Selectors

| #   | Lvl                 | Rule                                                                                                                                      | Example | Explanation |
|-----|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------|---------|-------------|
| 301 | <center>🔴</center> | CSS selectors must follow the BEM methodology.                                                                                            | Example | Explanation |
| 302 | <center>🔴</center> | Blocks, elements and modifiers, as well as other selectors must not start with `-` or a number.                                           | Example | Explanation |
| 303 | <center>🟡</center> | Whenever possible, classes should be used as selectors.                                                                                   | Example | Explanation |
| 304 | <center>🟡</center> | Data attributes and element selectors should only be used if there is no other way, like when dealing with certain third party libraries. | Example | Explanation |
| 305 | <center>🟡</center> | IDs should never be used as selectors.                                                                                                    | Example | Explanation |
| 306 | <center>🟡</center> | The styles inside a modifier should be kept at a minimum. If a style can be exist in the base class, it should be written there.          | Example | Explanation |

## 4. Element Mixins

| #   | Lvl                 | Rule                                                                                                                                      | Example | Explanation |
|-----|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------|---------|-------------|
| 401 | <center>🔴</center> | Parameters of an element mixin must not be used to transfer information from the call-site. The parameters are used by bem-plus packages. | Example | Explanation |
| 402 | <center>🟡</center> | An element mixin should contain all styles that affect this element. No other code should affect it the element in question.              | Example | Explanation |
| 403 | <center>🟡</center> | An element mixin should not contain selectors of other blocks or elements, except when used together with `@at-root`.                     | Example | Explanation |

## 5. Order

| #   | Lvl                 | Rule                                                                                              | Example | Explanation |
|-----|---------------------|---------------------------------------------------------------------------------------------------|---------|-------------|
| 501 | <center>🟡</center> | The order of things inside an element mixin should always be as follows:                          | Example | Explanation |
|     | <center>🟡</center> | Including mixins like `@include font(16, 20);`                                                    | Example | Explanation |
|     | <center>🟡</center> | Styles like `display: block;`                                                                     | Example | Explanation |
|     | <center>🔵</center> | `@media` breakpoint queries or mixins that facilitate this (e.g. `@include breakpoint(large) {}`) | Example | Explanation |
|     | <center>🔵</center> | Other `@media` queries like `@media print`                                                        | Example | Explanation |
|     | <center>🔵</center> | State selectors like `:hover` and `:focus`                                                        | Example | Explanation |
|     | <center>🔵</center> | Pseudo elements like `:before` and `:after`                                                       | Example | Explanation |
|     | <center>🔵</center> | Modifiers like `&--active`                                                                        | Example | Explanation |

Including mixins is at the top because you might want to override included styles with styles below. The rest of the order is meant to represent relevance to the class in question:
- Styles directly affect the element, so they're at the top.
- Media queries affect the element, but only when certain conditions are met.
- Pseudo elements are essentially separate elements attached to the class in question
- Modifiers are completely separate classes

## 6. Block files

| #   | Lvl                 | Rule                                                                                                                            | Example | Explanation |
|-----|---------------------|---------------------------------------------------------------------------------------------------------------------------------|---------|-------------|
| 601 | <center>🔴</center> | The index should not contain anything but selectors and `@include`s                                                             | Example | Explanation |
| 602 | <center>🔴</center> | Apart from the element mixins and the index, there should be nothing else in a block file. No loose selectors. No other mixins. | Example | Explanation |
| 603 | <center>🟡</center> | The index should be located at the end of each block file.                                                                      | Example | Explanation |
| 604 | <center>🟡</center> | Below the index mixin, the index mixin should be included.                                                                      | Example | Explanation |

## 7. The Index

| #   | Lvl                 | Rule                                                                                                                                                              | Example | Explanation |
|-----|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|-------------|
| 701 | <center>🔴</center> | Each block file must have an index with the name of the block.                                                                                                    | Example | Explanation |
| 702 | <center>🔴</center> | The index mixin should not contain anything but selectors and `@include`s                                                                                         | Example | Explanation |
| 703 | <center>🔴</center> | The index defines only the block and it's elements, no modifiers, pseudo elements or nested elements. All selectors in the index should have a specificity of 10. | Example | Explanation |
| 704 | <center>🔴</center> | The element mixin of the block itself should be called `[block-name]-root`                                                                                        | Example | Explanation |
| 705 | <center>🟡</center> | The index should be located at the end of each block file.                                                                                                        | Example | Explanation |

## 8. Miscellaneous CSS

Miscellaneous CSS is defined as global or reusable CSS code that cannot be associated with any specific block. This could be font loading, a reset, a collection of utility mixins.

| #   | Lvl                 | Rule                                                                           | Example | Explanation |
|-----|---------------------|--------------------------------------------------------------------------------|---------|-------------|
| 801 | <center>🔵</center> | Miscellaneous code should be kept in one place, separate from the block files. | Example | Explanation |

## 9. Templating

| #   | Lvl                 | Rule                                                                                                                    | Example | Explanation |
|-----|---------------------|-------------------------------------------------------------------------------------------------------------------------|---------|-------------|
| 901 | <center>🔴</center> | Each HTML tag can only have one bem-plus block or element class. It can have any number of modifier classes.            | Example | Explanation |
| 902 | <center>🔴</center> | The block or element class must be defined first, followed by any number of modifier classes.                           | Example | Explanation |
| 903 | <center>🔴</center> | Additional classes should be avoided. If they are required, they should be appended at the end, after bem-plus classes. | Example | Explanation |
| 904 | <center>🟡</center> | Classes should always be written out in full. They should not contain any dynamic parts like template literals.         | Example | Explanation |
