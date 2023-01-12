# angular-eslint-test-id-coverage

Highlights Angular template data containing and control elements without `data-test-id` attribute.
Made for cleaner code.

## Setup locally

```
git clone https://github.com/oprokidnev/angular-eslint-test-id-coverage ./rules
```

`package.json`
```
  "devDependencies": {
    "eslint-plugin-test-id-custom": "file:rules",
```

`.eslintrc.json`
```
...
{
      "files": [
        "*.html"
      ],
      "extends": [
        "plugin:@angular-eslint/template/recommended",
        "plugin:eslint-plugin-test-id-custom/recommended"
      ]
    }
```