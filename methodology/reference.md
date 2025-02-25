## Levels of rules

| Icon | Level       | Rule                                                                                                                   |
|------|-------------|------------------------------------------------------------------------------------------------------------------------|
| 🔴   | Required    | Rules that are an essential part of bem-plus. They must be followed, or some of the packages might not work correctly. |
| 🟡   | Recommended | Rules that help reduce bugs, or are otherwise deemed important, but not strictly required.                             |
| 🔵   | Convention  | Rules that help you structure your code the same throughout your application.                                          |

## 1. File system and overall structure

| #   | Lvl                 | Rule                                                                                                                                                             | Explanation                                            |
|-----|---------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------|
| 101 | <center>🔴</center> | Styles must be kept in stylesheets, separate from templates and JavaScript code (no Vue SFCs for example).                                                       | [Explanation](explanations/1XX%20File%20System/101.md) |
| 102 | <center>🔴</center> | There must only ever be one block per Stylesheet.                                                                                                                | [Explanation](explanations/1XX%20File%20System/102.md) |
| 103 | <center>🔴</center> | The file must be named the same as the block. A leading `_` is okay.                                                                                             | [Explanation](explanations/1XX%20File%20System/103.md) |
| 104 | <center>🔵</center> | Stylesheets should be stored in a dedicated directory (e.g. `/src/styles`), not together with other component files, and especially not together with templates. | [Explanation](explanations/1XX%20File%20System/104.md) |

## 2. Block files and the index

| #   | Lvl                 | Rule                                                                                                                                                              | Explanation                                                                |
|-----|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| 201 | <center>🔴</center> | Apart from the element mixins and the index, there should be nothing else in a block file. No loose selectors. No other mixins.                                   | [Explanation](explanations/2XX%20Block%20files%20and%20the%20index/201.md) |
| 202 | <center>🔴</center> | Each block file must have an index with the name of the block.                                                                                                    | [Explanation](explanations/2XX%20Block%20files%20and%20the%20index/202.md) |
| 203 | <center>🔴</center> | The index mixin should not contain anything but selectors and `@include`s                                                                                         | [Explanation](explanations/2XX%20Block%20files%20and%20the%20index/203.md) |
| 204 | <center>🔴</center> | The index defines only the block and it's elements, no modifiers, pseudo elements or nested elements. All selectors in the index should have a specificity of 10. | [Explanation](explanations/2XX%20Block%20files%20and%20the%20index/204.md) |
| 205 | <center>🔴</center> | The element mixin of the block itself should be called `[block-name]-root`                                                                                        | [Explanation](explanations/2XX%20Block%20files%20and%20the%20index/205.md) |
| 206 | <center>🟡</center> | The index should be located at the end of each block file.                                                                                                        | [Explanation](explanations/2XX%20Block%20files%20and%20the%20index/206.md) |
| 207 | <center>🟡</center> | Below the index mixin, the index mixin should be included.                                                                                                        | [Explanation](explanations/2XX%20Block%20files%20and%20the%20index/207.md) |

## 3. Co-location and organization

| #   | Lvl                 | Rule                                                                                                                                     | Explanation                                                               |
|-----|---------------------|------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| 301 | <center>🟡</center> | An element mixin should contain all styles that affect this element. No other code should affect the element in question.                | [Explanation](explanations/3XX%20Co-location%20and%20organization/301.md) |
| 302 | <center>🟡</center> | An element mixin should not contain selectors of other blocks or elements, except when used together with `@at-root` or inside `:has()`. | [Explanation](explanations/3XX%20Co-location%20and%20organization/302.md) |
| 303 | <center>🟡</center> | All `@at-root` selectors should end with `&`.                                                                                            | [Explanation](explanations/3XX%20Co-location%20and%20organization/303.md) |
| 304 | <center>🟡</center> | Keep your code DRY, but do not abstract things that you wouldn't want to change together. When in doubt, DO repeat yourself.             | [Explanation](explanations/3XX%20Co-location%20and%20organization/304.md) |
| 305 | <center>🔵</center> | Do not overuse variables. Do not use variables to define other variables.                                                                | [Explanation](explanations/3XX%20Co-location%20and%20organization/305.md) |

## 4. Selectors

| #   | Lvl                 | Rule                                                                                                                          | Explanation                                        |
|-----|---------------------|-------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|
| 401 | <center>🔴</center> | CSS selectors must follow the BEM methodology.                                                                                | [Explanation](explanations/4XX%20Selectors/401.md) |
| 402 | <center>🔴</center> | Blocks, elements and modifiers, as well as other selectors must not start with `-` or a number.                               | [Explanation](explanations/4XX%20Selectors/402.md) |
| 403 | <center>🟡</center> | Whenever possible, classes should be used as selectors, not ids, tags or attributes.                                          | [Explanation](explanations/4XX%20Selectors/403.md) |
| 404 | <center>🟡</center> | The styles inside a modifier should be kept at a minimum. If a style can exist in the base class, it should be written there. | [Explanation](explanations/4XX%20Selectors/404.md) |
| 405 | <center>🟡</center> | `+`, `~`, and `>` selectors are only allowed when used together with `@at-root`.                                              | [Explanation](explanations/4XX%20Selectors/405.md) |

## 5. Utility mixins
| #   | Lvl                 | Rule                                                                                                                                                            | Explanation                                               |
|-----|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------|
| 501 | <center>🟡</center> | Utility classes should not be used. Use utility mixins or modifiers instead.                                                                                    | [Explanation](explanations/5XX%20Utility%20mixins/501.md) |
| 502 | <center>🟡</center> | `%` / `@extend` should not be used. Use utility mixins instead.                                                                                                 | [Explanation](explanations/5XX%20Utility%20mixins/502.md) |
| 503 | <center>🔵</center> | Utility mixins should not contain selectors or media queries. Instead, create multiple utility mixins.                                                          | [Explanation](explanations/5XX%20Utility%20mixins/503.md) |
| 504 | <center>🔵</center> | Utility mixins can include other utility mixins, but do not go beyond 3 layers.                                                                                 | [Explanation](explanations/5XX%20Utility%20mixins/504.md) |

## 6. Naming

| #   | Lvl                 | Rule                                                                                                              | Explanation                                     |
|-----|---------------------|-------------------------------------------------------------------------------------------------------------------|-------------------------------------------------|
| 601 | <center>🟡</center> | The name of the element mixin should be `[block]-[element]`, for example `.header__title` becomes `header-title`. | [Explanation](explanations/6XX%20Naming/601.md) |
| 602 | <center>🟡</center> | Names of blocks, elements and modifiers should be defined in kebab-case.                                          | [Explanation](explanations/6XX%20Naming/602.md) |
| 603 | <center>🟡</center> | Elements should be separated from blocks by `__`. Modifiers should be separated from blocks and elements by `--`  | [Explanation](explanations/6XX%20Naming/603.md) |

## 7. Miscellaneous code

| #   | Lvl                 | Rule                                                                                                                                                                      | Explanation                                                   |
|-----|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------|
| 701 | <center>🔴</center> | Miscellaneous code like mixins, variables, font definitions and such, should be kept in one place, separate from the block files.                                         | [Explanation](explanations/7XX%20Miscellaneous%20code/701.md) |
| 702 | <center>🔴</center> | When breaking with bem-plus convention is unavoidable, like when working with third party libraries, those styles must be kept separate from the rest of the application. | [Explanation](explanations/7XX%20Miscellaneous%20code/702.md) |
| 703 | <center>🔴</center> | Parameters of an element mixin must not be used to transfer information from the call-site. The parameters are used by bem-plus packages.                                 | [Explanation](explanations/7XX%20Miscellaneous%20code/703.md) |
| 704 | <center>🟡</center> | The order of things inside an element mixin should follow a predictable pattern, from most related to the element, to least related.                                      | [Explanation](explanations/7XX%20Miscellaneous%20code/704.md) |


## 8. Templating

| #   | Lvl                 | Rule                                                                                                                                                                     | Explanation                                         |
|-----|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------|
| 801 | <center>🔴</center> | Each HTML tag can only have one bem-plus block or element class. It can have any number of modifier classes.                                                             | [Explanation](explanations/8XX%20Templating/801.md) |
| 802 | <center>🔴</center> | The block or element class must be defined first, followed by any number of modifier classes.                                                                            | [Explanation](explanations/8XX%20Templating/802.md) |
| 803 | <center>🔴</center> | Additional classes outside of bem-plus should be avoided. If they are required, they should be appended at the end, after bem-plus classes.                              | [Explanation](explanations/8XX%20Templating/803.md) |
| 804 | <center>🟡</center> | Classes should always be written out in full. They should not contain any dynamic parts like template literals.                                                          | [Explanation](explanations/8XX%20Templating/804.md) |
| 805 | <center>🟡</center> | Block or component concepts of other parts of the application, like templates or backend code, should in no way influence or limit where or how a BEM block can be used. | [Explanation](explanations/8XX%20Templating/805.md) |
