# JavaScript language features

Detailed rules from the language-feature sections of the Google JavaScript Style
Guide, plus its exceptions for legacy platforms, condensed. The [skill
entrypoint](../SKILL.md) lists the most common ones. Features the guide does not
mention may be used without restriction.

## Contents

-   [Variables](#variables)
-   [Array literals](#array-literals)
-   [Object literals](#object-literals)
-   [Enums](#enums)
-   [Classes](#classes)
-   [Functions](#functions)
-   [Strings and numbers](#strings-and-numbers)
-   [Control flow and exceptions](#control-flow-and-exceptions)
-   [`this` and equality](#this-and-equality)
-   [Disallowed features](#disallowed-features)
-   [Platforms without modern syntax](#platforms-without-modern-syntax)

## Variables

-   Declare every local with `const`, or with `let` when it is reassigned.
    Never use `var` outside the legacy exception below.
-   Declare one variable per statement; never write `let x = 0, y = 0;`.
-   Declare a local near its first use rather than at the top of its block,
    to keep its scope small, and initialize it as soon as you can.
-   A JSDoc type goes either in a JSDoc block on the line above or inline
    before the name (`const /** !Array<string> */ names = [];`) when no other
    JSDoc is present. Never combine both on one declaration: the compiler
    reads only the first JSDoc, so the inline type is lost.
-   Annotate locals whose template type cannot be inferred, such as an empty
    `Map`, `Set`, array, or object, or a variable a closure modifies;
    otherwise the template parameter is inferred as unknown.

## Array literals

-   Add a trailing comma whenever a line break separates the last element from
    the closing `]`.
-   Never pass elements to the `Array` constructor: with a single whole-number
    argument it creates that many empty slots, with another number it throws,
    and otherwise it creates a one-element array. Use a literal instead.
    `new Array(length)` remains allowed when you mean to allocate a length.
-   Keep arrays free of non-numeric properties other than `length`, whether
    defining or reading them; use a `Map` or an object.
-   Array destructuring may end with a rest element, with no space after
    `...`. Leave holes for unused elements, as in `const [, second] = pair;`.
-   A destructured array parameter that is optional defaults to `[]`, with
    element defaults on the left, as in `([first = 0, second = 1] = [])`; never
    supply the defaults as a populated default array.
-   When passing or returning several values, prefer object destructuring to
    array destructuring: it names each value and lets each have its own type.
-   Use spread (`[...items, ...more]`) instead of awkward `Array.prototype`
    calls such as `slice.call` or `concat`. Write no space after `...`.

## Object literals

-   Add a trailing comma whenever a line break separates the last property from
    the closing `}`.
-   Do not use the `Object` constructor, for consistency with `Array`; write
    `{}` or a populated literal.
-   Treat each literal as either a struct (unquoted keys or symbols) or a dict
    (quoted or computed keys), and never mix the two. The same goes for
    property names passed as strings: do not test a struct field with
    `hasOwnProperty('name')`, because a renaming compiler cannot rename the
    string; compare the field with `!= null` instead.
-   Computed keys are allowed and count as quoted keys unless they are
    symbols, such as `[Symbol.iterator]`. Enum values may serve as computed
    keys, but do not mix them with other keys in the same literal.
-   Method shorthand (`{start() {}}`) may replace a key whose value is a
    `function` or arrow literal. In shorthand methods and `function`s, `this`
    is the object literal; in an arrow it is the enclosing scope's `this`.
-   Shorthand properties (`{width, height}`) are allowed.
-   Object destructuring may unpack several values. In parameters, keep it to
    a single level of unquoted shorthand properties: no nesting and no
    computed keys. Put defaults inside the pattern (`{size = 10} = {}`), never
    in a populated default object, and default an optional destructured
    object to `{}`. The parameter's JSDoc name is arbitrary but required.
-   A destructured `goog.require` stays on one line however long it is.

## Enums

-   Define an enum by annotating an object literal with `@enum`. Declare it at
    module level, exported or not, never nested under a type or another
    object.
-   Enums are constant: never add properties after the definition. Each value
    is a string literal or a number.
-   Write string enum values statically: no arithmetic, template
    substitution, function calls, or references to variables. The restriction
    eases migration to TypeScript; for computed values, use a constant object
    without `@enum`.
-   Name enums with singular `UpperCamelCase` nouns and their members in
    `CONSTANT_CASE`. Document every enum with `@enum` and, when public, a
    description; members may have their own JSDoc.

## Classes

-   Constructors are optional. A subclass constructor calls `super()` before
    it sets a field or otherwise touches `this`.
-   Define every field (every non-method property) in the constructor, never
    in a nested scope inside it or on the prototype. Tag fields never
    reassigned with `@const` (shallow immutability suffices), and non-public
    fields with `@private`, `@protected`, or `@package`; `@private` names may
    end with `_`.
-   Do not add or delete instance properties after the constructor finishes;
    it defeats engine optimizations. Set fields that are filled in later to
    `undefined` in the constructor. Closure Compiler treats classes as
    `@struct` by default, which flags undeclared properties.
-   The guide sets no fixed order for class members.
-   Use only symbol computed keys in classes; quoted or computed non-symbol
    member names are not allowed. Define `[Symbol.iterator]` for logically
    iterable classes, and otherwise use `Symbol` sparingly: other built-in
    symbols are not polyfilled by the compiler for older browsers.
-   Where readability allows, use module-local functions instead of private
    static methods. Do not depend on dynamic dispatch of static methods: call
    one only on the class that defines it, not on a subclass that merely
    inherits it, and avoid calling it through a variable that may hold a
    subclass constructor (if you must, the method needs `@nocollapse`). Never
    use `this` inside a static method.
-   Do not define getter or setter properties; write ordinary methods. Only
    where one is unavoidable, as with data-binding frameworks or an external
    API you cannot change, define it carefully with `get`/`set` shorthand or
    `Object.defineProperties`, never `Object.defineProperty`, which breaks
    property renaming. A getter must not change observable state.
-   An overridden `toString` must always succeed and have no visible side
    effects; beware of calling other methods from it.
-   Declare interfaces with `@interface` or `@record`. Methods are non-static
    with empty bodies, and fields are declared in the constructor as
    uninitialized members. A `@record` may be implemented explicitly with
    `@implements` or implicitly by a matching class or object literal.
-   Use abstract classes where appropriate, marking classes and methods
    `@abstract`; never use `goog.abstractMethod`.
-   Do not write container classes holding only static methods or properties
    for namespacing; export the functions and constants themselves.
-   Do not attach a type (class, enum, typedef, interface) to another
    module-local name. Export it at top level with a clear name, and consider
    dropping redundancy with the module name, because importers can add a
    prefix more easily than remove one from a namespace import.
-   Prefer `class` syntax. Ordinary code does not manipulate `prototype`
    objects; mixins and changes to built-in prototypes are forbidden.
    Framework code that needs `prototype` (Polymer, Angular) may use it rather
    than worse workarounds.
-   Old-style constructor functions are acceptable only where `class` cannot
    work: subclasses, including framework-generated ones, that cannot move to
    `class` syntax yet, or frameworks needing `this` before the superclass
    constructor runs. All other rules still apply. Set per-instance properties
    in the constructor after the superclass call, and define methods on the
    prototype.

## Functions

-   Top-level functions may be exported directly or declared locally and
    exported separately. To name a nested function, assign it to a local
    `const`.
-   Prefer arrow functions to the `function` keyword for nested functions,
    though method shorthand still suits object literals. Prefer arrows to
    `f.bind(this)`, `goog.bind`, or `const self = this` for keeping `this`.
    An arrow wrapper also passes a callback exactly the arguments you choose,
    whereas binding forwards all of them.
-   Parentheses around a single non-destructured arrow parameter are optional;
    writing them anyway avoids breakage when a parameter is added later.
    Inline parameter types require parentheses.
-   Arrow bodies are blocks by default. Use a single-expression body only when
    the program needs the returned value, or when `void` precedes a single
    function or method call to discard it, and then only if it improves
    readability.
-   Attach a generator's `*` to `function` and leave a space before the name,
    as in `function* items()`; a generator method is written `* items()`. In
    delegating yields, attach `*` to `yield`, as in `yield* other()`.
-   Usually document parameter and return types with JSDoc. Declare generic
    functions and methods with `@template TYPE` in their JSDoc.
-   Optional parameters use `=` defaults with spaces on both sides of `=`,
    have no `opt_` prefix, carry the `=` suffix in their JSDoc type, follow
    the required parameters, and have initializers without observable side
    effects. Every optional parameter of a concrete function gets a default,
    even `undefined`; abstract and interface methods omit defaults.
-   Default values such as `{}` or `[]` are safe because they are evaluated
    on every call. Keep initializers simple, and avoid ones that expose shared
    mutable state. Use defaults sparingly; with more than a few optional
    parameters that have no natural order, take a destructured options
    object.
-   Use a rest parameter, never `arguments`. It comes last, has no space after
    `...`, is typed with a `...` prefix in JSDoc, and is not named `var_args`.
    Never name a variable or parameter `arguments`.
-   Use spread in calls (`fn(...values)`) instead of
    `Function.prototype.apply`, with no space after `...`.

## Strings and numbers

-   Delimit ordinary strings with single quotes. For text containing a single
    quote, consider a template literal to avoid escaping. Ordinary string
    literals never span lines.
-   Use template literals instead of complex concatenation, especially when
    several literals are involved. A template literal may span lines, and its
    continuation lines need not follow the code's indentation.
-   Never end a line inside an ordinary or template literal with a backslash
    continuation; trailing spaces after it cause subtle bugs. Concatenate
    shorter literals instead.
-   Number literals may be decimal, hexadecimal, octal, or binary, using
    exactly the lowercase prefixes `0x`, `0o`, and `0b`. Never write a leading
    zero that is not followed by `x`, `o`, or `b`.

## Control flow and exceptions

-   All three kinds of `for` loop may be used; prefer `for`-`of`. Use
    `for`-`in` only on dict-style objects, not arrays, and exclude inherited
    properties with `Object.prototype.hasOwnProperty`. Prefer `for`-`of` and
    `Object.keys` to `for`-`in` when you can.
-   Use exceptions for exceptional cases. Throw only `Error` or a subclass,
    constructed with `new`, never string literals or other objects; promise
    rejection values follow the same rule. Define custom errors where `Error`
    conveys too little, and prefer throwing to ad hoc schemes such as error
    container parameters or error properties on returned objects.
-   Doing nothing in a `catch` block is rarely right. When it is, a comment
    must explain why. In tests, use `assertThrows()` instead of a `try` that
    calls `fail()`, since the `catch` would swallow the failure.
-   In a `switch`, each statement group ends abruptly (`break`, `return`, or a
    throw) or has a comment, such as `// fall through`, saying that execution
    may continue into the next group; the last group needs none. Every
    `switch` has a `default` group, even an empty one, and it comes last. An
    explicit block may hold a group's statements when scoping requires it.

## `this` and equality

-   Reference `this` only within class constructors and methods, arrows
    declared inside those, or functions whose immediately enclosing JSDoc
    declares `@this`. Never use it for the global object, an `eval` context,
    an event target, or a function that is `call`ed or `apply`d needlessly.
-   Compare with the identity operators `===` and `!==`. The documented
    exception is `== null`, which matches both `null` and `undefined` but no
    other falsy values such as `0` or `''`.

## Disallowed features

-   `with`: it obscures meaning and strict mode has banned it since ES5.
-   `eval` and `Function(...string)`, except in code loaders: they are risky
    and fail under a Content Security Policy.
-   Missing semicolons: every statement ends with one, apart from function
    and class declarations.
-   Non-standard features: features since removed (such as `WeakMap.clear`),
    TC39 proposals at any stage, unfinished web standards, proprietary browser
    features, and non-standard extensions from transpilers. Use only what the
    current ECMA-262 or WHATWG standards define; code written for a specific
    API, such as Node.js or Chrome extensions, may use that API.
-   `new` on `Boolean`, `Number`, `String`, or `Symbol`, and those wrapper
    types in annotations. Calling them as functions to coerce a value is
    preferred over unary `+` or concatenating an empty string, and calling
    `Symbol` creates symbols.
-   Changes to built-in types, by adding to their constructors or prototypes,
    and dependence on libraries that make them. Only the compiler's
    standards-compliant polyfills may modify built-ins. Add globals only when
    something such as a third-party API requires it.
-   `new` without an argument list: write `new Foo()`, because `new Foo.Bar()`
    and `new Foo().Bar()` mean different things.

## Platforms without modern syntax

When modern ECMAScript syntax is unavailable, the guide allows `var`, use of
`arguments`, and optional parameters without default values. With `var`:

-   Remember that `var` is scoped to the enclosing function, script, or
    module, not the block; closures created in a loop share one variable.
-   Declare each `var` as close to its first use as possible, but not inside
    a block when it is also used after that block.
-   For a global that would be a `const`, annotate the `var` with `@const`;
    this is optional for locals.
-   Never declare a function inside a block, which was not standardized before
    ES2015 and behaves inconsistently; assign a function expression to a `var`
    in the block instead.

This reference adapts the Google JavaScript Style Guide under [CC BY
3.0](https://creativecommons.org/licenses/by/3.0/); see the attribution in the
[skill entrypoint](../SKILL.md).
