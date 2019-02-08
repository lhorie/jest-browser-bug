# Jest node module resolution bug when using browser field

### How to reproduce

```
git clone git@github.com:lhorie/jest-browser-bug.git
cd jest-browser-bug
yarn
yarn test
```

#### Expected

Test should pass, console should log `1`

#### Actual

Test fails, console logs `2`

#### Explanation

Running `node index` logs `1`.

The `index.js` file requires two modules: `ab` and `ac`, both of which `require` a third module `aa`. The `aa` module is symlinked from a monorepo-like structure and not hoisted to the top level node_modules. The folder structure looks like this:

```
- aa
  - index.js
- node_modules
  - ab
    - index.js
    - node_modules
      - symlink to aa
  - ac
    - index.js
    - node_modules
      - symlink to aa
```

When jest runs w/ the option `browser: false`, node module resolution works as intended: it detect that `ab/node_modules/aa` and `ac/node_modules/aa` are both symlinks to the same physical folder and run the `aa` module only once.

However, when `browser: true`, `ab/node_modules/aa` and `ac/node_modules/aa` are considered to be different packages and run `aa` twice.

This is problematic for several reasons:

- top level side effects occur more times than they are intended to, potentially leading to race conditions if they touch network or filesystem
- exported entities lose reference equality (thus failing checks like `===`, `instanceof`, etc that they would otherwise pass)
- symbols no longer work across dependent modules
