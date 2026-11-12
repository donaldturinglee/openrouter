---
name: javascript-styleguide
description: >-
  Apply the Google JavaScript Style Guide when writing, editing, refactoring,
  or reviewing JavaScript source, tests, and JSDoc in .js, .mjs, .cjs, and
  .jsx files and in scripts embedded in HTML, even when no style guide is
  mentioned. Covers source file structure, ES modules, formatting, language
  features, naming, JSDoc type annotations, and legacy Closure goog.module
  code. Do not apply it to TypeScript (.ts, .tsx, .mts, .cts, or declaration
  files); use the TypeScript style guide skill for those, because its class,
  naming, and JSDoc rules differ.
license: CC-BY-3.0
---

# Google JavaScript style guide

Apply the [Google JavaScript Style
Guide](https://google.github.io/styleguide/jsguide.html) to the JavaScript you
change: `.js`, `.mjs`, `.cjs`, and `.jsx` files and scripts embedded in HTML.
Google no longer updates this guide and recommends moving to TypeScript; treat
that as background, not a reason to convert a project. The guide allows
current ECMA-262 and WHATWG features unless it restricts them.

Explicit user instructions, the project's configuration (formatter, linter,
type checker, transpilation targets, framework contracts), and established
local conventions take precedence. Do not migrate toolchains or module systems,
mass-reformat files, or rename public APIs merely to apply the guide. Keep
style-only cleanup separate from behavior changes, and explain material
deviations. The guide assumes Closure Compiler, whose type system its JSDoc
uses; Closure is not a prerequisite, and ES modules are the primary path here.

-   Read [language features](references/language-features.md) when you need
    detailed rules on literals, destructuring, enums, classes, functions,
    loops, exceptions, or `switch`, or target platforms without modern syntax.
-   Read [JSDoc and types](references/jsdoc.md) when writing or reviewing
    JSDoc, Closure type annotations, nullability, casts, or visibility tags.
-   Read [Closure modules and tooling](references/closure.md) when a file uses
    `goog.module`, `goog.provide`, `goog.require`, `goog.scope`, or
    `goog.defineClass`, or the project builds with Closure Compiler.

## Source files

-   Name files in lowercase, with underscores or dashes but no other
    punctuation, following the project's convention. The guide names only the
    `.js` extension; keep `.mjs`, `.cjs`, or `.jsx` where the runtime or build
    depends on it.
-   Use UTF-8. Besides line terminators, the ASCII space (0x20) is the only
    whitespace character: escape other whitespace in strings, and never
    indent with tabs.
-   Use the dedicated escapes (`\'`, `\"`, `\\`, `\b`, `\f`, `\n`, `\r`, `\t`,
    `\v`) instead of numeric ones, and never legacy octal escapes. For other
    non-ASCII characters, write the character or an escape, whichever reads
    better, and comment escapes that are not obvious.
-   Order an ES module as: license or copyright notice, `@fileoverview`,
    imports, implementation, with exactly one blank line between the sections
    present (one or two before the implementation). Neither a copyright notice
    nor `@author` is required.
-   New files should be ES modules, or `goog.module` files in a Closure
    codebase. The guide covers no other module system: keep CommonJS and
    classic HTML scripts where the runtime expects them. In HTML, apply these
    rules to the script content and the document's conventions to the markup.

## ES modules

-   Never wrap `import` or `export ... from` statements; they are exempt from
    the column limit.
-   Import ES modules with `import`, never `goog.require`, and always write the
    file extension (`./parser.js`, or `.mjs` when that is the real one); bare
    package specifiers have none to add. Import each file only once.
-   Name a namespace import (`import * as name`) in `lowerCamelCase` after the
    file: `import * as dateUtils from './date_utils.js'`. The guide's only
    listed exception is three.js's `THREE`.
-   Keep named imports under their exported names. Resolve collisions with a
    namespace import or by renaming the export; build an unavoidable alias
    from parts of the imported file's name or path.
-   Export by name (`export` on a declaration or `export {name};`), never by
    default; keep a default export a framework requires, and say why. Default
    imports serve only modules outside the guide and are named after the file.
-   Export only what other modules use, in any order. Module-local names are
    private already, so never tag them `@private`.
-   Do not mutate exported bindings after module initialization; export a
    constant object with mutable fields, or accessor functions, instead.
-   Do not create import cycles, including through `export ... from`.

## Formatting

The guide recommends `clang-format`, whose output complies though authors may
adjust it; a formatter the project configures, such as Prettier, prevails.

-   Brace every control-structure body, even a single statement, and start a
    nonempty block's first statement on a new line. Exception: a simple `if`
    without `else` that fits on one line may drop its braces.
-   Use K&R braces: no break before `{`, a break after it and before `}`, and a
    break after `}` only when it ends a statement or a function, class, or
    method body; never break between `}` and a following `else`, `catch`,
    `while`, comma, semicolon, or `)`. An empty block may be `{}`, except in
    `if`/`else` or `try`/`catch`/`finally` chains.
-   Indent block contents, comments included, +2 spaces. Array and object
    literals may be laid out as blocks if you choose. In `switch`, indent
    labels +2 and their statements another +2. A function literal among call
    arguments indents its body +2 from the line where it starts.
-   Write one statement per line, each ending in a semicolon; never rely on
    automatic semicolon insertion. Class declarations and methods take no
    semicolon; a statement containing a class expression does.
-   Limit lines to 80 columns. Exempt are `import` and `export ... from`
    statements, Closure module and require lines, and lines that cannot comply
    or would lose discoverability, such as long URLs, copyable shell commands,
    or literals like file paths that people search for whole.
-   Wrap at the highest syntactic level. Break after an operator but before a
    `.`; keep a function or constructor name with its `(` and a comma with
    the token before it; never break between `return` and its value; break
    JSDoc types after `{`. Extracting a variable or method can avoid wrapping.
-   Indent continuation lines at least +4 from the first line; deeper levels
    may use larger multiples of 4, and equal indentation signals parallel
    elements. Keep call arguments on the call's line when they fit; otherwise
    wrap them with a four-space indent, filling lines or one per line.
    Aligning to the open parenthesis is allowed but discouraged.
-   Separate the methods of a class or object literal with one blank line
    (optional between plain properties). Use blank lines sparingly within
    function bodies, never at a body's start or end; several consecutive
    blank lines are permitted, never required.
-   No trailing whitespace. Beyond what the language or other rules require,
    use a single space only: after reserved words other than `function` and
    `super` before `(`; between `}` and a following keyword such as `else`;
    before `{`, except an object literal that is a first argument or first
    array element, and template `${`; around binary and ternary operators;
    after, never before, a comma or semicolon; after an object literal's
    colon; around the `//` of an end-of-line comment (extra spaces allowed);
    and after `/*` or `/**` and on both sides of `*/` in inline comments.
    Cross-line alignment is allowed but discouraged and need not be kept.
-   Omit optional grouping parentheses only when author and reviewer agree
    they would neither prevent a misreading nor make the code easier to read.
    Never parenthesize the whole operand of `delete`, `typeof`, `void`,
    `return`, `throw`, `case`, `in`, `of`, or `yield`. Closure type casts
    require parentheses.
-   Indent comments with the code, using `//` or `/* ... */`; later lines of a
    `/* */` comment start with an aligned `*`. Draw no boxes around comments,
    and never use `/** */` for implementation comments.
-   When a literal argument's meaning is unclear and the API cannot reasonably
    change, comment it: `/* verbose= */ true` before the value, or the name
    after the value without `=` to match nearby code.

## Language features

-   Declare locals with `const`, or `let` if reassigned, never `var`: one per
    declaration, near first use, initialized promptly.
-   Use literals, not the variadic `Array` constructor or `Object`;
    `new Array(length)` is fine for a length. Add a trailing comma whenever
    the closing bracket or brace is on a later line than the last item.
-   Never mix quoted (dict-style) and unquoted (struct-style) keys in one
    object literal; non-symbol computed keys count as quoted. Keep arrays free
    of non-numeric properties.
-   Keep destructured object parameters to one level of unquoted shorthand
    properties, with defaults on the left; an optional destructured parameter
    defaults to `{}`, or `[]` for an array.
-   Use `class` syntax. Do not manipulate prototypes directly, modify
    built-ins, write static-only container classes, nest types on
    module-local names, or define getters and setters unless unavoidable.
-   Prefer arrows for nested functions and for keeping `this`, not `bind` or
    `const self = this`. Use an expression body only when its value is needed
    or `void` precedes a single call.
-   Quote strings with `'`, use template literals rather than complex
    concatenation, and never continue a string with a backslash. Prefer
    `for`-`of`; use `for`-`in` only on dict-style objects, with an
    own-property check.
-   Throw, and reject promises with, only `Error` objects built with `new`;
    an empty `catch` needs a comment saying why. Give every `switch` a final
    `default` group, and mark any group that can continue into the next with
    a comment such as `// fall through`.
-   Use `===` and `!==`, except `== null` to match `null` and `undefined`. Use
    `this` only in constructors, methods, arrows within them, or functions
    with an `@this` JSDoc declaration.
-   Never use `with`, `eval` or `Function(...string)` outside code loaders,
    `new` on primitive wrappers, `new Foo` without `()`, built-in prototype
    changes, or non-standard features.

## Naming

| Identifier | Style | Notes |
| --- | --- | --- |
| Class, interface, record, typedef | `UpperCamelCase` | Nouns; interfaces may be adjectives. Unexported classes are not `@private`. |
| Enum | `UpperCamelCase` | Singular noun; members in `CONSTANT_CASE`. |
| Method, function | `lowerCamelCase` | Verb phrases; `@private` methods may end in `_`. |
| Constant | `CONSTANT_CASE` | Deeply immutable module-level `const` or `@const` static property; no trailing `_`. |
| Non-constant field | `lowerCamelCase` | Private fields may end in `_`. |
| Parameter, local variable | `lowerCamelCase` | Also when holding a constructor, and for constants inside functions. |
| Template parameter | All caps | One word or letter, such as `T` or `KEY`. |
| Namespace import | `lowerCamelCase` | Derived from the imported file name. |

-   Use ASCII letters and digits; underscores only where the guide allows,
    and `$` only as a parameter prefix a third-party framework requires.
-   Choose descriptive names over short ones; avoid unfamiliar or
    letter-dropping abbreviations and Hungarian prefixes. A variable whose
    scope spans no more than 10 lines, such as a non-API argument, may have a
    short name; public methods take no one-letter parameters.
-   Derive camel case from prose: convert to ASCII without apostrophes, split
    into words, lowercase everything (acronyms too), capitalize each word's
    first letter (except the first word's for `lowerCamelCase`), and join.
    "HTML parser" gives `htmlParser`; "user ID" gives `userId`. Splitting
    conventional camel-case words ("PayPal" to `payPal`) is recommended.
-   Optional accessor methods are `getFoo` (`isFoo` or `hasFoo` for booleans)
    and `setFoo`; test methods may use `_` separators, as in
    `testParse_emptyInput_throws`.
-   A `const` holding mutable state, such as a `Set` or a logger, is not a
    constant and stays `lowerCamelCase`. Local aliases are `const` and keep
    the last part of the aliased name.
-   The guide has no JSX rules; JSX needs capitalized component names, so
    component functions stay `UpperCamelCase`.

## JSDoc essentials

-   Put well-formed JSDoc, in Markdown, on all classes, fields, and methods;
    a multi-line block puts `/**` and `*/` on their own lines.
-   Document parameter and return types in braces (`@param {string} name`),
    also on overrides, which need `@override`; omit the return type only when
    nothing is returned. Method descriptions are third-person verb phrases.
-   Mark reference types `!` or `?`; primitives are non-null unless marked
    `?`. Always supply template arguments, such as `!Array<string>`.
-   Put most tags on their own lines and indent wrapped tag text four spaces.
    Give `@deprecated` clear directions for callers. Under another type
    checker, such as TypeScript's `checkJs`, write types in its syntax.

## Policies

-   Where the guide is silent, match the file, then the package. New files
    follow the guide; new code in a nonconforming file matches that file
    without breaking the guide, ideally after reformatting it first.
-   Existing code need not be reformatted, but a significantly changed file
    is expected to conform. Keep unrelated style fixes in separate changes,
    and do not let local rules block such cleanups.
-   Generated code is mostly exempt; identifiers that handwritten code uses
    follow the naming rules, underscores allowed.

## Check the change

Run the project's configured formatter, linter, type checker, and relevant
tests. When the project configures none, the public tool the guide names is
`clang-format` with its Google style; Closure Compiler at
`--warning_level=VERBOSE`, its linter, and its conformance framework apply only
to projects that already build with Closure. Do not add tooling solely for this
skill, and do not treat clean formatting or lint output as proof of
correctness. For a review-only request, report findings (file and line, the
rule, a minimal fix) without editing files.

## Source and attribution

This skill is adapted and condensed from the [Google JavaScript Style
Guide](https://google.github.io/styleguide/jsguide.html), checked on 2026-11-03
at commit `ab89e73` of the `gh-pages` branch of
[google/styleguide](https://github.com/google/styleguide). It condenses and
reorganizes the guide and adds application guidance; it is not an official
Google publication. The guide is licensed under [CC BY
3.0](https://creativecommons.org/licenses/by/3.0/), and its code samples under
[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0).
