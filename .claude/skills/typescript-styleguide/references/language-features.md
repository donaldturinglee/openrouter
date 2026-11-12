# TypeScript language features

Detailed rules from the language-feature sections of the Google TypeScript Style
Guide, condensed. The [skill entrypoint](../SKILL.md) lists the most common
ones. Features the guide does not discuss may be used without restriction.

## Contents

-   [Variables, arrays, and objects](#variables-arrays-and-objects)
-   [Classes](#classes)
-   [Functions](#functions)
-   [Literals and coercion](#literals-and-coercion)
-   [Control flow](#control-flow)
-   [Exceptions](#exceptions)
-   [Assertions](#assertions)
-   [Decorators and disallowed features](#decorators-and-disallowed-features)

## Variables, arrays, and objects

-   Declare with `const` by default and `let` only for reassignment; `var` is
    never allowed, because its function scoping causes bugs. Never use a
    variable before its declaration, and declare one variable per statement.
-   Never call `Array()`, with or without `new`; its arguments mean different
    things depending on their count and type. Use bracket literals, and for an
    array of a given size either set `length` on an empty literal or use
    `Array.from` with a `length` argument. Keep arrays free of non-numeric
    properties other than `length`; use a `Map` or an object instead.
-   Array destructuring may end with a rest element (no space after `...`) and
    should leave holes for unused elements. Default an optional destructured
    array parameter to `[]`, with element defaults on the left, never through
    a populated default array. For several values passed or returned
    together, object destructuring is preferable because it names them.
-   Never use the `Object` constructor; write a literal.
-   Unfiltered `for`-`in` over an object is not allowed, because it also
    visits inherited enumerable properties. Skip non-own keys with
    `hasOwnProperty`, or loop with `for`-`of` over `Object.keys` or
    `Object.entries`.
-   Object spread (`{...base, extra: 1}`) makes a shallow copy in which later
    keys replace earlier ones. Avoid spreading anything whose prototype is not
    `Object.prototype`, such as classes, class instances, functions, or
    arrays, since only own enumerable properties are copied.
-   Computed keys are allowed. One that is not a symbol counts as a quoted,
    dict-style key and must not be mixed with unquoted keys.
-   Keep a destructured parameter to a single level of unquoted shorthand
    properties, with no nesting and no computed keys. Put defaults inside the
    pattern (`{size = 1}: Options = {}`), never in a populated default object,
    and default an optional destructured object to `{}`.

## Classes

-   Never put a semicolon after a class declaration's closing brace, but do
    end a statement containing a class expression with one. Blank lines just
    inside the class braces are optional either way.
-   Separate method declarations with one blank line and no semicolons. Set
    the constructor off with a blank line above and below.
-   Turn state used only while constructing into constructor-local variables:
    services the constructor alone uses should be plain parameters, not
    parameter properties, and helpers that only the constructor calls should
    not leave fields behind.
-   An overridden `toString` must always succeed and must not have visible
    side effects; calling other methods from it risks infinite loops.
-   Where readability allows, use module-local functions instead of private
    static methods.
-   Do not depend on dynamic dispatch of static methods. Call one only on the
    class that defines it, never on a subclass that merely inherits it, and
    avoid calling it through a variable that may hold a subclass constructor
    (if done, the guide requires `@nocollapse`, a Closure Compiler tag).
-   Never use `this` in a static context. Static fields are inherited and can
    be overridden through `this`, which surprises readers and encourages
    hard-to-test static state.
-   Call constructors with parentheses even without arguments. Omit a
    constructor that is empty or only forwards to `super`; keep one that has
    parameter properties, visibility modifiers, or parameter decorators, even
    with an empty body.
-   Do not use `#private` fields: down-leveling them costs code size and
    speed, and they add little where the type checker enforces visibility.
    Use the `private` modifier.
-   Mark a property never reassigned outside the constructor `readonly` (it
    need not be deeply immutable). Use a parameter property, such as
    `constructor(private readonly store: Store) {}`, rather than assigning an
    argument to a separately declared field, and document it with `@param`.
-   Initialize a member where it is declared unless it depends on a
    constructor parameter, which can make the constructor unnecessary. Never
    reference a parameter property from a field initializer: as TypeScript
    moves to JavaScript's semantics, that becomes a compiler error. Assign
    such fields in the constructor instead.
-   Never add properties to an instance or remove them after construction.
    Initialize optional fields that are filled in later to `undefined`, so
    the object's shape stays stable.
-   A member used outside the class's lexical scope must be `protected` or
    `public`, not `private`. The stated exception is an Angular component
    property that only its template reads. Never write `obj['member']` to get
    around visibility; that breaks under other build setups and optimizers.
-   Getters and setters may be used. A getter must be pure: consistent
    results and no observable side effects. A property hidden behind an
    accessor may take any whole-word prefix or suffix, such as `internal` or
    `wrapped`; use the accessor to read it where possible.
-   At least one accessor of a property must do real work. Rather than
    pass-through accessors, make the property public, or `readonly` if only a
    getter would exist. Never define accessors with `Object.defineProperty`,
    which defeats property renaming.
-   Class members may use only symbol computed keys, never quoted or computed
    non-symbol keys. Define `[Symbol.iterator]` on logically iterable classes,
    and otherwise use `Symbol` sparingly; other built-in symbols may not be
    polyfilled for older browsers.
-   Restrict visibility as far as possible. Consider replacing private
    methods with non-exported functions in the same file, and private state
    with a separate non-exported class. Members are public by default; write
    `public` only on non-readonly public parameter properties.
-   Ordinary code does not manipulate `prototype` objects, and mixins and
    changes to built-in prototypes are forbidden. Framework code that needs
    `prototype` (Polymer, Angular) may use it rather than worse workarounds.

## Functions

-   Prefer a function declaration to an arrow or function expression for a
    named function. An arrow is appropriate when the function needs an
    explicit type annotation, such as an interface type.
-   Nested functions may be declarations or arrows; inside methods, prefer
    arrows, which keep the outer `this`.
-   Never write function expressions; use arrows. The only exceptions are code
    that must rebind `this` dynamically, which is discouraged, and
    generators, which have no arrow form.
-   Use a concise (expression) body only when the function's return value is
    used. Otherwise write a block body, which makes the return type `void`,
    or put `void` before the expression to discard its value.
-   Function declarations and expressions must not use `this` unless they
    exist to rebind it; arrows or explicit parameters usually remove the
    need. To keep `this`, an arrow beats `bind`, `goog.bind`, or a saved
    `self` variable.
-   Avoid passing a named function as a callback unless both signatures are
    known to be stable; a higher-order function may pass extra arguments,
    such as array indices, into optional parameters. Pass an arrow that
    forwards exactly the intended arguments.
-   Classes usually should not hold properties initialized to arrow
    functions, because callers then need non-local knowledge that `this` is
    bound. Call instance methods through an arrow at the use site, as in
    `(item) => { this.handle(item); }`, and do not pass or store bare method
    references such as `this.handle`. Use judgment where arrow properties
    make code clearer, such as template bindings.
-   Event handlers may be inline arrows when they never need removal, for
    example for events the class emits itself. When a handler must be
    removed later, an arrow-function property is right because it gives a
    stable bound reference. Never call `bind` in the expression that installs
    a handler: the temporary reference can never be removed.
-   Parameter defaults must not have observable side effects and should stay
    simple; do not expose shared mutable state through them. Use defaults
    sparingly, and with more than a few optional parameters that have no
    natural order, take a destructured options object.
-   Use a rest parameter instead of `arguments`, never name a variable or
    parameter `arguments`, and use spread instead of
    `Function.prototype.apply`. Write no space after `...`.
-   Function bodies never start or end with a blank line; inside, blank lines
    may sparingly group statements. Attach a generator's `*` to its keyword:
    `function* items()` and `yield* other`. Parentheses around a single arrow
    parameter are recommended but optional.
-   Keep functions and methods small and focused. There is no hard limit, but
    past about 40 lines consider splitting, as long as the structure does not
    suffer. Warning signs include deep nesting, separate blocks that each need
    a comment, exception handling scattered through the body, and code that
    does not fit on one screen. Helpers used only once are fine.
-   Use `this` only in class constructors and methods, functions declaring a
    `this` parameter type, or arrows defined where `this` is allowed; never
    for the global object, an `eval` context, an event target, or a function
    needlessly invoked through `call` or `apply`.

## Literals and coercion

-   Delimit ordinary strings with single quotes. A string that contains a
    single quote may use double quotes instead of escaping it.
-   No backslash line continuations inside ordinary or template literals;
    concatenate pieces, or keep one long string where splitting would hinder
    searching for it. Use template literals instead of complex concatenation;
    a multi-line one need not follow the surrounding indentation.
-   Number literals may be decimal, hexadecimal, octal, or binary, using
    exactly the lowercase prefixes `0x`, `0o`, and `0b`; never write another
    leading zero.
-   Coerce with `String()` or `Boolean()` (never with `new`), template
    literals, or `!!`. Converting with string concatenation is discouraged,
    because the operands of `+` are checked for matching types.
-   Never convert an enum value, or a union that includes an enum type, to a
    boolean, explicitly or implicitly; compare it with specific members. By
    default the first member is `0`, so it alone is falsy, which surprises
    readers.
-   Numeric parsing can fail in many ways, so check every result and handle
    non-throwing failures such as `NaN`. Use `Number()`; never unary `+`,
    which is easy to overlook, or `parseFloat`, which ignores trailing
    garbage. Use `parseInt` only when a non-decimal radix is needed, after
    checking that every character is a valid digit, and check its result for
    `NaN` too.
-   Do not add explicit boolean coercion, such as `!!value`, to `if`, `for`, or
    `while` conditions, which already coerce. Other values may be tested
    implicitly or compared explicitly, as with a length tested against `0`.

## Control flow

-   Braced blocks are required for `if`, `else`, `for`, `do`, `while`, and
    similar statements, even around one statement, and a nonempty block's
    first statement starts on its own line. Exception: an `if` statement that
    fits on one line may omit the block.
-   Prefer to avoid assignments inside control conditions, where they look
    like comparisons; wrap an intended one in an extra pair of parentheses.
-   Prefer `for`-`of` for arrays; `Array.prototype.forEach` and indexed `for`
    loops are also allowed, and `entries()` yields index and value together.
    Use `for`-`in` only on dict-style objects, filtering inherited keys with
    `hasOwnProperty`, and never on arrays, where it yields string indices.
    Where possible, loop `for`-`of` over `Object.keys`, `Object.values`, or
    `Object.entries` instead of using `for`-`in`.
-   Omit optional grouping parentheses only when author and reviewer agree
    they would neither prevent a misreading nor make the code easier to read;
    do not assume everyone knows the precedence table. Never parenthesize the
    whole operand of `delete`, `typeof`, `void`, `return`, `throw`, `case`,
    `in`, `of`, or `yield`.
-   Every `switch` contains a `default` group, last, even when it is empty.
    Each nonempty group ends with `break`, `return`, or a throw and never
    falls through, which the compiler enforces; empty groups may fall
    through.
-   Use `===` and `!==`, whose behavior is predictable and fast. Only a
    comparison with the literal `null` may use `==` or `!=`, to cover both
    `null` and `undefined`.

## Exceptions

-   Use exceptions for exceptional cases. Define custom error classes where
    `Error` carries too little, and prefer throwing to ad hoc approaches such
    as error-container parameters or error fields on returned objects.
-   Instantiate errors with `new Error(...)`, not by calling `Error(...)`.
-   Throw only `Error` or its subclasses, never strings, numbers, `null`,
    `undefined`, or other objects, because only errors get stack traces. The
    rule covers every API that throws its argument: `Promise.reject`, a
    promise executor's `reject`, and the `abort` methods of `AbortController`
    and `AbortSignal`. Calling `abort()` with no argument is fine, since it
    supplies an `AbortError` itself.
-   When catching, assume the value is an `Error`; the guide's examples type
    it `unknown` and narrow it with an assertion helper. Do not defensively
    handle other values unless the called API is known to throw them, and
    then say in a comment where they come from.
-   An empty `catch` block needs a comment explaining why ignoring the error
    is correct. Do not check for an expected throw with a `try` that calls
    `fail()`, because the `catch` swallows that failure; use `assertThrows()`
    or the test framework's equivalent.
-   When passing `ErrorOptions`, make `cause` an `Error` to build a chain of
    stack traces; a caught `unknown` value may be passed without checking.
    Never pass an error object itself as the options argument, which
    TypeScript accepts by accident.
-   Keep `try` blocks to the code that can throw, moving other statements
    after the block, unless that hurts readability. Exception: a `try` may
    cover a whole loop, since one inside a loop can cost performance.

## Assertions

-   Type assertions (`x as Foo`) and non-null assertions (`y!`) only silence
    the compiler; they add no runtime check and can let the program crash.
    Use them only for an obvious or explicitly stated reason, and prefer a
    runtime check such as `instanceof` or a nullness test. When local
    knowledge makes one safe, comment why, unless the reason is evident.
-   Write assertions with `as`, never angle brackets, so that a member access
    on the result needs parentheses.
-   When the compiler rejects an assertion because the types do not overlap
    enough, and the assertion is still safe, assert through `unknown` (never
    `any` or `{}`) with an explanatory comment.
-   Give an object literal a type annotation (`: Foo`) instead of asserting it
    with `as Foo`, so that misspelled or renamed fields are reported.

## Decorators and disallowed features

-   Do not define new decorators; the feature diverged from the TC39
    proposal and has known bugs. Use only decorators that frameworks define;
    the guide lists Angular's (such as `@Component` and `@NgModule`) and
    Polymer's (such as `@property`).
-   A decorator immediately precedes the symbol it decorates, with no blank
    line between. A field decorator may sit on the field's line or above it.
    JSDoc goes before the decorator.
-   Never instantiate `String`, `Boolean`, or `Number` wrappers; for example,
    `new Boolean(false)` is truthy. Calling them as functions to coerce is
    fine. End every statement explicitly with a semicolon rather than relying
    on automatic semicolon insertion.
-   Use a plain `enum`, never `const enum`, which hides the enum from
    JavaScript users of the module. Production code contains no `debugger`
    statements.
-   Never use `with`, nor `eval` or `Function(...string)` outside code
    loaders; they are dangerous and fail under strict Content Security Policies.
-   Use only standard features: nothing deprecated or removed from
    ECMAScript or the web platform, no TC39 proposals or other features absent
    from the current ECMA-262, no WHATWG proposals that have not completed
    their process, and no non-standard extensions from transpilers. Projects
    targeting a specific runtime, such as Node.js, Electron, Chrome
    extensions, or only the latest Chrome, may use its APIs. Treat
    proprietary APIs found in only some browsers with caution, and consider a
    library that abstracts them.
-   Never modify built-in types, through their constructors or prototypes,
    and avoid libraries that do. Add symbols to the global object only when
    absolutely necessary, such as for a third-party API.

This reference adapts the Google TypeScript Style Guide under [CC BY
3.0](https://creativecommons.org/licenses/by/3.0/); see the attribution in the
[skill entrypoint](../SKILL.md).
