# Tooling

## Stylelint

You can find a complete stylelint config [here](). Note that this config will not catch all violations of bem-plus methodology.

### stylelint-selector-bem-pattern

This package won't catch all violations of bem-plus methodology, not even all violations of BEM methodology, but it does catch some basic stuff and, if set up correctly, does not report any false positives. The recommended setup looks like this:

```js
// stylelint.config.js
export default {
    plugins: [
        'stylelint-selector-bem-pattern'
    ],
    rules: {
        // ...
        'plugin/selector-bem-pattern': {
            preset: "bem",
            implicitComponents: true,
            ignoreSelectors: [/&--/, /&$/],
        }
    }
}
```
