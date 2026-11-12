# JSDoc and Closure type annotations

Condensed JSDoc rules from the Google JavaScript Style Guide. Its type syntax is
Closure Compiler's. Where a project type-checks JavaScript with another tool,
write types in the syntax that tool accepts and keep the documentation rules.
The [skill entrypoint](../SKILL.md) summarizes the essentials.

## Contents

-   [Form and layout](#form-and-layout)
-   [File overviews](#file-overviews)
-   [Classes, interfaces, and records](#classes-interfaces-and-records)
-   [Enums and typedefs](#enums-and-typedefs)
-   [Methods and functions](#methods-and-functions)
-   [Properties](#properties)
-   [Type annotations](#type-annotations)
-   [Visibility](#visibility)
-   [Tag reference](#tag-reference)

## Form and layout

-   JSDoc goes on all classes, fields, and methods. Tools extract and act on
    it, so it must be well-formed.
-   A JSDoc that does not fit on one line uses the multi-line form, with `/**`
    and `*/` on their own lines. Short entries may stay on one line, as in
    `/** @private @const {!Cache} Shared lookup cache. */`.
-   Write descriptions in Markdown, using HTML only when necessary. Generated
    documentation ignores plain-text layout, so a list written as indented
    lines collapses into one sentence; use a Markdown list.
-   The guide permits only a subset of JSDoc tags. Most tags occupy their own
    line and begin it. Simple tags that take no data, such as `@private`,
    `@const`, `@final`, and `@export`, may share a line, with a type where
    one applies. No rule fixes which tags to combine or their order; be
    consistent.
-   Indent wrapped lines of a block tag four spaces. Lining wrapped
    description text up with the previous line is allowed but discouraged.
    Do not indent wrapped `@desc` or `@fileoverview` text.

## File overviews

-   A file may begin with an `@fileoverview` JSDoc that orients new readers:
    what the file contains, its uses, its dependencies, or compatibility
    notes. It is generally recommended when a file holds more than one class
    definition.
-   A copyright notice, author information, and a default visibility tag may
    appear in it; none is required.

## Classes, interfaces, and records

-   Document every class, interface, and record with a description and the
    relevant tags: template parameters, implemented interfaces, visibility,
    and so on. The description should tell readers how and when to use the
    type and what to watch for. A constructor may omit its textual
    description.
-   With the `class` keyword, do not write `@constructor` or `@extends`,
    except that a subclass of a generic class must state the template type,
    as in `@extends {Base<string>}`, even when it only passes the parameter
    along.
-   An `@interface` or `@record` that extends another uses the `@extends`
    tag, never the `extends` keyword.

## Enums and typedefs

-   Tag every enum and typedef with `@enum` or `@typedef` on the preceding
    line; public ones also need a description. Individual enum members may
    have a JSDoc line of their own.
-   Use typedefs for short record types and for aliases of unions, complex
    function types, or generic types. Avoid typedefs for records with many
    fields, since they cannot document fields, use templates, or refer to
    themselves; prefer `@record`.

## Methods and functions

-   In methods and named functions, document every parameter type and the
    return type, even on `@override` methods with the same signature, and the
    `this` type when necessary. The return type may be omitted only when the
    function has no `return` with a value.
-   Descriptions of the method, its parameters, or its return value (never
    the types) may be omitted when the rest of the JSDoc or the signature
    makes them obvious.
-   Begin a method description with a verb phrase in the third person, as if
    "This method" preceded it ("Returns the ...", not "Return the ...").
-   A method that overrides a superclass method has `@override` and repeats
    every `@param` and `@return`, even when no type is refined, to match
    TypeScript.
-   When only types are needed, inline JSDoc in the signature may replace the
    tags, as in `function /** number */ area(/** number */ side) {}`. Any
    description or other tag requires one JSDoc block above the function;
    inline JSDoc never carries descriptions and never precedes a method name.
-   For anonymous functions, annotations are generally optional. Add
    parameter and return types when inference falls short or the annotation
    helps readers, typically inline on the parameters and with `@return`
    above the function.

## Properties

-   Document the type of every property. A private property may skip the
    description when its name and type explain it.
-   Document exported constants the way you document properties.

## Type annotations

-   Types go on `@param`, `@return`, `@this`, and `@type`, and optionally on
    `@const`, `@export`, and visibility tags. Always enclose them in braces.
-   Nullability modifiers precede the type: `!` for non-null, `?` for
    nullable. Primitive types (`boolean`, `number`, `string`, `symbol`,
    `null`, `undefined`) and literal types (function types and record types
    such as `{id: number}`) are non-null by default: add `?` when needed and
    never a redundant `!`. Reference types, meaning `UpperCamelCase` class,
    enum, record, or typedef names, always take an explicit `!` or `?`,
    because the name alone does not reveal nullability.
-   When the compiler infers a type too loosely and `goog.asserts` cannot fix
    it, cast with a type comment on a parenthesized expression:
    `/** @type {!Element} */ (node)`. The parentheses are required.
-   Always supply template parameters, as in `!Array<string>`,
    `!Object<string, !User>`, or `!Promise<undefined>`. The exception is
    `Object` used as a type in the class hierarchy rather than as a map.
-   Do not write a function type expression (a type using the `function`
    keyword) where the function's definition is present, including anonymous
    functions and functions assigned to a `const`; use `@param` and `@return`
    or inline types. Function type expressions belong in `@typedef`,
    `@param`, and `@return`, and on variables or properties of function type
    that are not initialized with a definition.
-   Always state a function type's return type, as in
    `function(string): number` or `function(): undefined`; without one it
    defaults to unknown (`?`), which silently disables checking.
-   Inside a type, put one space or a line break after each comma and colon,
    and no other whitespace: write `number|string`, not `number | string`,
    and `{id: number, name: string}`. Break long types to improve readability
    or respect the column limit, following the usual wrapping and
    indentation rules.

## Visibility

-   Use `@private`, `@package`, and `@protected` in a `@fileoverview` block or
    on exported symbols and properties.
-   Never mark local variables, whether inside a function or at a module's top
    level, with visibility; module-local names are private already.
-   A `@private` name may end in `_`; that suffix is optional.

## Tag reference

-   Closure Compiler's own tags and type syntax are documented in its wiki
    pages [Annotating JavaScript for the Closure
    Compiler](https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler)
    and [Types in the Closure Type
    System](https://github.com/google/closure-compiler/wiki/Types-in-the-Closure-Type-System).
-   Documentation-only tags the guide lists:
    -   `@bug number` names the bug a test function covers, one tag per bug.
    -   `@desc` describes a message, such as one built with `goog.getMsg`.
    -   `{@link Name}` creates a cross-reference in generated documentation;
        for external URLs, use a Markdown link instead.
    -   `@see` points to a related class, function, or method.
    -   `@supported` in a file overview lists supported browsers.
-   `@author` and `@owner` are not recommended. Source files need no
    copyright notice or author credit.
-   Do not use `{@code ...}` (write Markdown backticks), `@expose` (use
    `@export` or `@nocollapse`), or `@inheritDoc` (use `@override`).
-   Framework-specific tags exist for AngularJS (`@ngInject`) and Polymer
    (`@polymerBehavior`). Other tags from third-party JSDoc tag references
    are not part of Google style.
-   Mark deprecated methods, classes, and interfaces with `@deprecated` and
    simple, clear directions for fixing call sites.

This reference adapts the Google JavaScript Style Guide under [CC BY
3.0](https://creativecommons.org/licenses/by/3.0/); see the attribution in the
[skill entrypoint](../SKILL.md).
