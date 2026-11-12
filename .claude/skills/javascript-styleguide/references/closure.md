# Closure modules and tooling

Google-specific material from the Google JavaScript Style Guide, condensed. Use
it only for code that already uses Closure Compiler or the Closure Library;
everywhere else, ES modules and the [skill entrypoint](../SKILL.md) apply. Do
not introduce Closure constructs into a project that lacks them.

## Contents

-   [goog.module files](#googmodule-files)
-   [goog.require and goog.requireType](#googrequire-and-googrequiretype)
-   [ES modules alongside Closure](#es-modules-alongside-closure)
-   [Closure-specific language rules](#closure-specific-language-rules)
-   [Legacy goog.provide files](#legacy-googprovide-files)
-   [Compiler warnings](#compiler-warnings)
-   [Tools](#tools)

## goog.module files

-   A `goog.module` file declares exactly one module, with `goog.module(...)`
    on a single line that is never wrapped, whatever its length.
-   The argument defines the namespace: a package name reflecting the
    directory path, optionally followed by the main class, enum, or interface
    the file defines, appended in `lowerCamelCase`. Package names are
    `lowerCamelCase` throughout, or may follow TypeScript's path-based
    pattern, typically lowercase with the underscores of the file names.
-   No module name may sit one level directly beneath another module's name:
    modules `app.data` and `app.data.cache` cannot coexist. Directories mirror
    the namespace hierarchy, so owners of a parent namespace see every child.
-   A `goog.module` file is ordered: license or copyright, `@fileoverview`,
    the `goog.module` statement, the `goog.require` and `goog.requireType`
    block, then the implementation, with one blank line between sections (one
    or two before the implementation).
-   `goog.module.declareLegacyNamespace()` may directly follow the module
    statement, but avoid it. It exists only to ease migration from
    `goog.provide`, and a module that calls it must be neither parent nor
    child of any other `goog.module`.
-   `goog.setTestOnly()` may follow the module statement (and any
    `declareLegacyNamespace` call), or, in an ES module, the imports.
-   Export through the `exports` object, by defining symbols on it directly or
    by declaring them locally and assigning an object of them. Export only
    what other files use, do not mark unexported symbols `@private`, and
    order them freely.
-   Never annotate `exports` with `@const`, since the compiler already treats
    it as constant, and never assign a single value to `exports` as a default
    export: it does not map cleanly onto ES module semantics.

## goog.require and goog.requireType

-   Names imported with `goog.require` may appear in code and in type
    annotations; names from `goog.requireType` only in type annotations. Use
    one `goog.require` for a namespace used both ways, never both statements
    for the same namespace.
-   Keep all of them in one contiguous block without blank lines, directly
    after the module statement and its blank line, and nowhere else in the
    file. Each argument is a namespace that a `goog.module` defines elsewhere.
    Never wrap a require line, however long.
-   Assign each require to a single `const` alias or destructure it into
    `const` aliases, and refer to dependencies only through those aliases;
    fully qualified names appear only as the require argument. Declarations
    from externs files are the exception and keep fully qualified names.
-   A single alias equals the last dotted component of the namespace. A longer
    alias built from more of the namespace's components, keeping the original
    casing, may disambiguate otherwise identical aliases or significantly
    improve readability. It is required whenever the short alias would shadow
    a native type (`Map`, `Promise`, `Element`, `Error`, and the like).
-   When renaming in a destructuring require, put a space after the colon.
-   A module required only for its side effects uses `goog.require` (never
    `goog.requireType`) without assignment, with a comment saying why it is
    needed and suppressing the compiler warning, for example through
    `@suppress {extraRequire}`.
-   Sort the block: requires assigned to a single name, by that name; then
    destructuring requires, by their left-hand names; then standalone
    requires. An IDE can report ordering mistakes.
-   Legacy code that requires a whole module into a class-named alias (the
    "default export" style) is discouraged; prefer destructuring.

## ES modules alongside Closure

-   An ES module reaches the `goog` namespace by importing Closure's
    `goog.js`, which exports a subset of the global `goog` usable from ES
    modules.
-   Never use `goog.require` to load another ES module; use `import`. Inside
    an ES module, `goog.require` works as it does in a `goog.module` and
    returns any Closure namespace created by `goog.provide` or
    `goog.module`.
-   `goog.declareModuleId('name')` gives an ES module a `goog.module`-style
    ID. Requiring that ID, or reading it with `goog.module.get`, always yields
    the module object, as with `import *`, so the ID should end with a
    `lowerCamelCase` name. It creates no global symbol. Reserve it for
    converting existing Closure files into ES modules with named exports.
-   An ES module cannot call `goog.module.declareLegacyNamespace`, and no
    direct way exists to give an ES module a legacy namespace.

## Closure-specific language rules

-   Old-style classes, where ES6 `class` is not feasible: prefer
    `goog.defineClass` for new code. A constructor function annotated
    `@constructor` and `@extends`, linked with `goog.inherits` and defining
    methods on its prototype, is also allowed; use `goog.inherits` rather
    than wiring prototypes by hand.
-   A static method that is called through a variable holding a constructor
    or subclass constructor must be defined with `@nocollapse`, although such
    dynamic calls are discouraged.
-   Before casting with `/** @type {...} */ (value)`, check whether
    `goog.asserts` can narrow the type instead.
-   Do not use `goog.abstractMethod`; mark abstract members `@abstract`.
-   Local aliases follow the `goog.require` naming rules and keep the last
    part of the aliased name. They must be `const` and may also be declared
    inside functions.

## Legacy goog.provide files

`goog.provide` dependency management is deprecated. New files use
`goog.module`, even in projects that still contain `goog.provide` files. For
existing provide files:

-   List every `goog.provide` first and every `goog.require` second, with a
    blank line between the two lists. Sort each alphabetically, uppercase
    first, and never wrap the lines.
-   Provide only top-level symbols. Keep all members of a class in one file
    and provide only the class, not its constants, enums, inner classes, or
    methods. Members of a namespace may be provided.
-   `goog.scope` is deprecated as well; do not add it to new files. Existing
    uses follow these rules: one call per file, at global scope, preceded by
    exactly one blank line after the provides, requires, or top comments;
    closed on the file's last line with `// goog.scope` two spaces after the
    semicolon; body not indented. Alias only names never reassigned, such as
    most constructors, enums, and namespaces, and give each alias the name of
    the global's last property.
-   Prefer `goog.requireType` to `goog.forwardDeclare` for breaking cycles
    within a library; `goog.requireType` may refer to a namespace before it
    is defined. Format `goog.forwardDeclare` like the requires and sort it
    with them. Do not use it across library boundaries; split or merge
    libraries to remove such cycles.
-   A `goog.provide` file that depends on a `goog.module` cannot reach the
    module's exports through a global name. It needs both `goog.require`,
    which creates the build dependency, and `goog.module.get('name')`, which
    returns the exports.
-   Use `goog.module.declareLegacyNamespace` only while a module's callers
    still rely on `goog.provide`, and remove it once they use `goog.module`.
    If they cannot move soon, wrap the consuming file's contents in
    `goog.scope`, read the module there with `goog.module.get`, and delete
    the `declareLegacyNamespace` call.

## Compiler warnings

-   Projects should use `--warning_level=VERBOSE` where possible.
-   Understand a warning before acting on it. Then try, in order: fix it or
    restructure to avoid it; if it is a false alarm, explain why in a comment
    and add `@suppress`; as a last resort, leave a TODO and do not suppress
    it, so the warning stays visible.
-   Suppress at the narrowest reasonable scope, usually one local variable or
    a very small method, extracting one for that purpose if needed. Many
    narrow suppressions are better than blinding a whole class to a warning.

## Tools

-   Closure Compiler type-checks, optimizes, and transforms code, for example
    lowering it to ECMAScript 5.
-   The Closure Compiler linter checks for common missteps and anti-patterns.
-   The JS Conformance Framework, part of Closure Compiler, adds
    project-specific checks, such as forbidding a property, a function call,
    or missing type information. Teams use it for critical restrictions like
    defining globals and for security patterns like `eval` or `innerHTML`
    assignments. See its
    [documentation](https://github.com/google/closure-compiler/wiki/JS-Conformance-Framework).

This reference adapts the Google JavaScript Style Guide under [CC BY
3.0](https://creativecommons.org/licenses/by/3.0/); see the attribution in the
[skill entrypoint](../SKILL.md).
