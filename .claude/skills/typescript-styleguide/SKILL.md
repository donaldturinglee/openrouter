---
name: typescript-styleguide
description: >-
  Apply the Google TypeScript Style Guide when writing, editing, refactoring,
  or reviewing TypeScript source, TSX components, declaration files, tests,
  and their JSDoc (.ts, .tsx, .mts, .cts, .d.ts), even when no style guide is
  mentioned. Covers imports and exports, language features, classes, naming,
  the type system, compiler suppressions, and comments, and marks where it
  departs from the older JavaScript guide on formatting, classes, naming,
  and JSDoc types. Do not apply it to JavaScript or JSX (.js, .mjs, .cjs,
  .jsx); use the JavaScript style guide skill for those.
license: CC-BY-3.0
---

# Google TypeScript style guide

Apply the [Google TypeScript Style
Guide](https://google.github.io/styleguide/tsguide.html) to the TypeScript you
change: `.ts`, `.tsx`, `.mts`, and `.cts` files and declaration files. The
public guide is Google's internal TypeScript guide minus internal sections, and
it warns that Google's constraints may not apply elsewhere. It names no
TypeScript version, column limit, or indentation width and expects automatic
formatting, so the project's formatter decides layout.

Explicit user instructions, the project's configuration (`tsconfig` options,
formatter, linter, framework contracts), and established local conventions take
precedence. Do not migrate toolchains, mass-reformat files, or rename public
APIs merely to apply the guide. Keep style-only cleanup separate from behavior
changes, and explain material deviations. Google-internal tools the guide
mentions are not prerequisites.

-   Read [language features](references/language-features.md) when you need
    the detailed rules for classes, functions and callbacks, literals and
    coercion, control flow, exceptions, assertions, or decorators.
-   Read [type system](references/type-system.md) when choosing annotations,
    absent values, object, array, or index types, `any`, `unknown`, `{}`,
    generics, or compiler suppressions.

## Differences from the JavaScript guide

This guide stands alone and does not defer to the older JavaScript guide;
shared rules (named exports, `const`, braces, semicolons, `===`, `Error`-only
throws) apply because this guide states them too. Do not carry over these:

| Topic | TypeScript guide | JavaScript guide, not applicable here |
| --- | --- | --- |
| Layout | No column limit or indentation width stated; formatted automatically | 80 columns, +2 block and +4 continuation indents |
| Modules | ES modules only; no `namespace` or `import x = require()` | `goog.module` and `goog.require`; `.js` required in import paths |
| Types in JSDoc | Never; TypeScript syntax carries them | Closure types such as `{!Array<string>}`, plus `@enum`, `@private`, `@implements`, `@override` |
| JSDoc coverage | Top-level exports and members whose purpose is not obvious | All classes, fields, and methods |
| Interfaces and enums | `interface` declarations; `enum`, never `const enum` | `@interface` or `@record` classes; `@enum` objects |
| Fields | Initialized at declaration, parameter properties, `readonly` | Assigned in the constructor, tagged `@const` |
| Private members | `private` and `protected`; no `#private`; no `_` prefix or suffix | `@private`, optional trailing `_` |
| Accessors | `get` and `set` allowed, with conditions | Not used unless unavoidable |
| Named functions | Function declarations; function expressions only to rebind `this` or for generators | Arrows preferred for nested functions |
| Optional parameters | A default initializer is optional | Concrete functions give every optional parameter a default |
| `switch` | Nonempty groups never fall through | Commented fall-through allowed |
| Multi-line comments | Consecutive `//` lines only | `/* ... */` also allowed |
| `Array` constructor | Never, with or without `new` | `new Array(length)` allowed |
| Strings and non-ASCII | Double quotes may avoid escaping `'`; escapes only for non-printable characters | Template literal suggested; character or escape by readability |
| Constants | `CONSTANT_CASE` may mark intended immutability | Only for deeply immutable values |
| Type parameters | `T` or `UpperCamelCase` | All caps, such as `TYPE` |

## Files and modules

-   Use UTF-8, with the ASCII space as the only whitespace character besides
    line terminators. Use dedicated escapes (`\n`, `\'`) instead of numeric
    ones and never octal escapes. Write other non-ASCII characters literally,
    escaping only non-printable ones, with a comment.
-   Order a file as: copyright notice (in a JSDoc at the top, if needed),
    `@fileoverview`, imports, implementation, with exactly one blank line
    between the sections present.
-   Import TypeScript with namespace (`import * as name`) or named imports.
    Use default imports only for external code that requires them, and
    side-effect imports (`import 'pkg';`) only for load-time effects.
-   Import by path: relative within one logical project, with short `../`
    chains, or rooted at the base directory. The guide sets no extension
    rule; follow the compiler's module resolution, which may require one (ES
    module files under `NodeNext` need `.js`).
-   Prefer named imports for frequent or clearly named symbols and namespace
    imports for many symbols from a large API. Fix collisions with a
    namespace import or by renaming the export; rename an import with `as`
    only when needed, as for collisions or generated or unclear names.
-   `import type` may be used for symbols used only as types; values need
    ordinary imports. Re-export types with `export type`, and never write
    `import('./mod').Type` in an annotation.
-   Use ES modules only: no `namespace` (unless third-party code requires
    one), `module Foo {}`, `import x = require()`, or `/// <reference>`.
    Declaration files may use the ambient forms their external code needs;
    generated or tool-owned ones may keep the directives they rely on.
-   Use named exports, never `export default` (keep one a framework requires,
    and say why), and export only what other modules use. Never `export let`:
    expose changing state through getters so exports are final after the
    module runs. Do not use static-only classes as namespaces.

## Language rules

-   Declare with `const`, or `let` when reassigned, never `var`: one variable
    per declaration, never used before it is declared.
-   Use literals, never `Array()` or `Object()`; `Array.from` sizes an array.
    Keep arrays free of non-numeric properties.
-   Iterate arrays with `for`-`of`, `forEach`, or an indexed loop, and objects
    with `Object.keys`, `values`, or `entries`. A `for`-`in` needs a
    `hasOwnProperty` filter and never iterates an array.
-   Brace every control-flow body and start its first statement on a new
    line; only a one-line `if` may omit braces. End statements with
    semicolons instead of relying on automatic insertion.
-   Quote with `'`, or `"` to avoid escaping `'`. Use template literals
    instead of complex concatenation; never continue a line with a backslash.
-   Use `===` and `!==`; only comparisons with the `null` literal may use `==`
    or `!=`. Give every `switch` a last `default` group, even an empty one;
    nonempty groups never fall through.
-   Throw, reject, and abort only with `Error` objects (or subclasses),
    created with `new`. In `catch`, assume an `Error` unless an API is known to
    throw something else, and comment that case. Explain empty `catch`
    blocks, and keep `try` blocks to the code that can throw.
-   Coerce with `String()`, `Boolean()`, `!!`, or template literals. Parse
    numbers with `Number()` and handle `NaN`; never use unary `+` or
    `parseFloat`, and use `parseInt` only for a non-decimal radix on
    validated digits. Never coerce enum values to booleans.
-   Avoid `as` and non-null `!` assertions without an obvious or commented
    reason, and prefer runtime checks. Write `as`, not angle brackets; assert
    through `unknown` when a double assertion is needed; annotate object
    literals (`const config: Config = {...}`) instead of asserting them.
-   Prefer function declarations for named functions and arrows elsewhere,
    with a concise arrow body only when its value is used (or `void` it).
-   Never use `const enum`, production `debugger`, `with`, `eval` or
    `Function(...string)` outside code loaders, wrapper constructors,
    built-in changes, or non-standard features. Define no new decorators;
    place framework ones (Angular's, Polymer's) directly before their targets.

## Classes

-   No semicolon after a class declaration or between methods, but one after
    a statement containing a class expression. Set methods and the
    constructor off from other members with one blank line.
-   Omit empty or `super`-forwarding constructors unless they declare
    parameter properties, visibility, or parameter decorators. Always call
    constructors with parentheses.
-   Use `private` and `protected`, never `#private`; write `public` only on
    non-readonly public parameter properties. A member used outside the
    class's lexical scope cannot be `private` (Angular properties used only by
    a template are exempt), and `obj['member']` must not bypass visibility.
-   Mark properties never reassigned after construction `readonly`. Prefer
    parameter properties to copying constructor arguments into fields;
    initialize other fields where declared, never from a parameter property.
    Keep construction-only state in constructor locals, and never add or
    remove properties after construction.
-   Accessors are allowed when the getter is pure and at least one accessor
    does real work; a hidden backing field takes a whole-word affix such as
    `internal`. Never define them with `Object.defineProperty`.
-   Prefer module-local functions to private static methods, call static
    methods on their defining class, and never use `this` in static code.

## Types

-   Rely on clear inference. Skip annotations on unexported variables and
    parameters initialized with `string`, `number`, or `boolean` literals, and
    generic arguments that repeat an annotation, but keep what
    `isolatedDeclarations` needs on exports. Return types are the author's
    choice unless the project requires them.
-   Use `undefined` or `null` as the API's context suggests. Never bake
    `|null` or `|undefined` into an alias; add it where the alias is used.
-   Use `interface` for object types, not object-literal aliases or classes
    used as shapes, and annotate structural values where they are declared.
-   Write `T[]` or `readonly T[]` for simple element types (letters, digits,
    and dots), and `Array<...>` or `ReadonlyArray<...>` otherwise.
-   Prefer a specific type or `unknown` to `any`, and avoid `{}`. Never use
    the `String`, `Boolean`, `Number`, or `Object` types. Choose the simplest
    type construct that works.
-   Every file must type-check. Do not use `@ts-ignore`, `@ts-nocheck`, or
    `@ts-expect-error`; unit tests may use the last but generally should not.

## Naming

| Style | Used for |
| --- | --- |
| `UpperCamelCase` | Classes, interfaces, types, enums, decorators, type parameters, TSX component functions, JSX element type parameters |
| `lowerCamelCase` | Variables, parameters, functions, methods, properties, module aliases |
| `CONSTANT_CASE` | Global constants: module-level values, static readonly fields of module-level classes, enum values |

-   Use ASCII letters and digits; `_` only in constants, structured test
    names, and unused-identifier prefixes, never as a suffix; `$` rarely, for
    framework conventions or a team's consistent `Observable` suffix.
-   Keep type information out of names: no `_` affixes on private members, no
    `opt_` prefix, and no `I` prefix or `Interface` suffix unless idiomatic in
    that environment.
-   Make names descriptive for a new reader, without ambiguous abbreviations
    or dropped letters. A variable in scope for 10 lines or fewer, such as a
    non-API argument, may have a short name.
-   Treat acronyms as words (`fetchHtmlPage`, not `fetchHTMLPage`) unless a
    platform name dictates otherwise, as `XMLHttpRequest` does.
-   Use `CONSTANT_CASE` only for values created once per program; a
    function's local `const`, or anything else instantiated repeatedly, is
    `lowerCamelCase`, and an arrow function implementing an interface may be
    too. Local aliases copy the original's format and are `const` or
    `readonly`.
-   Type parameters are a capital letter or `UpperCamelCase`; test methods
    may use `_` separators (`testSave_whenOffline_queuesWrite`). Prefix a
    required but unused identifier with `_`; omit unused trailing parameters
    unless the method is meant to be overridden.
-   Namespace import names are `lowerCamelCase`, unlike `snake_case` file
    names; jQuery's `$` and three.js's `THREE` are the listed exceptions.

## Comments and JSDoc

-   Use JSDoc (`/** ... */`) for documentation and `//` for implementation
    comments. Write multi-line implementation comments as consecutive `//`
    lines, never `/* ... */` or boxes.
-   Keep JSDoc well-formed Markdown: a multi-line block puts `/**` and `*/` on
    their own lines, most tags take their own line, and wrapped tag lines
    indent four spaces.
-   Document every top-level export, except symbols exported only for
    tooling such as `@NgModule` classes, and every member whose purpose is not
    obvious from its name. Add information instead of restating names.
-   Never restate types: no types in `@param` or `@return`, no `@implements`,
    `@enum`, `@private`, or `@override` beside the matching keyword, and
    `@param` or `@return` lines only when they add something.
-   Begin method descriptions with a third-person verb phrase, tell readers
    in class comments how and when to use the class, and document parameter
    properties with `@param`. Put JSDoc before decorators, and give
    `@deprecated` clear directions for migrating callers.
-   Clarify an unclear literal argument with `/* name= */ value`, or consider
    an options object; files using the older after-value form may keep it.

## Policies

-   Where the guide is silent, match the file, then the directory. New files
    must follow the guide; new code in a nonconforming file should match the
    file without breaking the guide, ideally after reformatting it first.
-   Existing code need not be reformatted, but a significantly changed file
    is expected to conform; keep unrelated style fixes separate. Generated
    code is mostly exempt, though identifiers that handwritten code uses
    follow the naming rules (underscores allowed).

## Check the change

Run the project's formatter, linter, type checker, and relevant tests. Every
file must pass type checking with the standard toolchain, so run `tsc` or the
project's type-check script; a transpile-only build proves nothing about types.
The guide names no formatter; use the configured one. Its public conformance
checkers, [tsetse](https://tsetse.info) and
[tsec](https://github.com/google/tsec), apply only where the project already
runs them. Do not add tooling solely for this skill, and do not treat clean
formatting or lint output as proof of correctness. For a review-only request,
report findings (file and line, the rule, a minimal fix) without editing files.

## Source and attribution

This skill is adapted and condensed from the [Google TypeScript Style
Guide](https://google.github.io/styleguide/tsguide.html), checked on 2026-11-03
at commit `ab89e73` of the `gh-pages` branch of
[google/styleguide](https://github.com/google/styleguide). It condenses and
reorganizes the guide and adds application guidance; it is not an official
Google publication. The guide is licensed under [CC BY
3.0](https://creativecommons.org/licenses/by/3.0/), and its code samples under
[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0).
