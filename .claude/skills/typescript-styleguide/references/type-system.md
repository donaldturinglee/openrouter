# TypeScript type system

Detailed rules from the type-system and toolchain sections of the Google
TypeScript Style Guide, condensed. The [skill entrypoint](../SKILL.md)
summarizes them.

## Contents

-   [Inference and annotations](#inference-and-annotations)
-   [Absent values](#absent-values)
-   [Object types](#object-types)
-   [Arrays and dictionaries](#arrays-and-dictionaries)
-   [Type operators](#type-operators)
-   [`any`, `unknown`, and empty objects](#any-unknown-and-empty-objects)
-   [Wrapper and generic types](#wrapper-and-generic-types)
-   [Compiler and conformance](#compiler-and-conformance)

## Inference and annotations

-   Code may rely on the compiler's inference for any type: variables,
    fields, return types, and so on.
-   Leave out annotations that are trivially inferred, meaning unexported
    variables or parameters initialized with a `string`, `number`, or
    `boolean` literal. An annotation is not trivial on an exported symbol
    that `isolatedDeclarations` requires to be explicit, such as an exported
    template-literal string.
-   Do not repeat generic arguments that an annotation already supplies.
    Locally, write `new Set<string>()` without an annotation; an export
    instead carries the annotation and omits the repeated argument.
-   Annotate complex expressions whose type is hard to see, such as the
    awaited result of a chain of calls. The code reviewer decides whether an
    annotation is required.
-   Return type annotations are the author's choice. Reviewers may ask for
    them on complex return types, and projects may require them everywhere,
    but the guide does not. They document intent and surface type errors
    sooner when a change alters the returned type.

## Absent values

-   TypeScript code may use `undefined` or `null` for an absent value; the
    guide prefers neither. Follow the API's context: many JavaScript APIs,
    such as `Map.get`, use `undefined`, while many DOM APIs use `null`.
-   Never put `|null` or `|undefined` into a type alias's union. Nullable
    aliases pass absence through too many layers and hide where it began.
    Add the absent case where the alias is used, and handle null values close
    to where they arise.

## Object types

-   TypeScript's types are structural. When a value implements a structural
    type, annotate it at its declaration (`const point: Point = {...}`), so
    a missing or extra field is reported there rather than at a distant call.
-   Define structural types with interfaces, not classes.
-   Declare object types with `interface`, not a type alias of an object
    literal type. The two are nearly equivalent, so the guide picks one, and
    interfaces have technical advantages. Aliases still suit primitives,
    unions, tuples, and other type expressions.
-   Instead of a pair-like interface, a function may return a tuple type,
    such as `[string, string]`, which callers destructure. Named properties
    are often clearer, though, and an inline object type, such as
    `{width: number, height: number}`, suits cases where a full interface is
    too heavy.

## Arrays and dictionaries

-   For element types that are simple (only letters, digits, and dots), use
    `T[]` or `readonly T[]` rather than `Array<T>` or `ReadonlyArray<T>`,
    and `T[][]` for multi-dimensional arrays that are not `readonly`.
-   Use `Array<...>` or `ReadonlyArray<...>` for anything more complex, such
    as unions or object literal types. Apply the rule at every nesting level,
    so a simple `T[]` stays sugared inside a complex type.
-   Give index signatures a meaningful key label, such as
    `{[userId: string]: Session}`, not `[key: string]`; the label documents
    the key and is otherwise unused.
-   Consider `Map` and `Set` instead of objects used as associative arrays:
    plain objects behave surprisingly, and the ES types state the intent and
    accept keys that are not strings.
-   `Record<Keys, Value>` builds a type with a statically known set of keys,
    which differs from an associative array.

## Type operators

-   Mapped and conditional types, including library operators such as
    `Record`, `Partial`, `Readonly`, and `Pick`, may be used, but weigh their
    costs. Readers must evaluate them mentally, their behavior with inference
    is underspecified and changes between compiler versions, and tooling such
    as find-references or rename may miss their properties.
-   Always use the simplest construct that expresses the type; a little
    repetition is often cheaper than a complex type expression.
-   Interface extension, or a nested field holding the shared properties, is
    often easier to understand than deriving a subset with `Pick`; it makes
    the grouping explicit and helps tools.

## `any`, `unknown`, and empty objects

-   Avoid `any`: it is assignable both ways and allows any property access,
    so it masks real errors. Consider these alternatives instead.
-   Provide a more specific type: an interface (including a `declare
    interface` for server JSON), an inline object type, a type alias, or a
    generic parameter where a library would otherwise accept anything.
-   Use `unknown` when a value is genuinely unknown. It accepts any value but
    allows no property access until a type guard narrows it.
-   When `any` is legitimate, as for a deliberately partial mock in a test,
    suppress the lint warning on that line and add a comment explaining why
    it is safe.
-   Do not use `{}` for most purposes: it accepts every non-nullish value,
    primitives included. Prefer `unknown` for opaque values,
    `Record<string, T>` for dictionary-like objects, or `object` for any
    non-nullish function or object.

## Wrapper and generic types

-   Never use the `String`, `Boolean`, or `Number` types; use `string`,
    `boolean`, and `number`. Never use `Object` either. In its place the
    guide names `{}` for every value except `null` and `undefined`, or
    `object` to exclude primitives too; the advice against `{}` above still
    applies.
-   Never call `String`, `Boolean`, or `Number` with `new`.
-   Avoid creating APIs whose generic parameter appears only in the return
    type. When calling an existing API of that kind, always pass the type
    argument explicitly.

## Compiler and conformance

-   All TypeScript files must pass type checking with the standard toolchain.
-   Do not use `@ts-ignore`, `@ts-expect-error`, or `@ts-nocheck`. A
    suppressed error usually points at a larger problem that can be fixed
    directly, and suppression makes the surrounding types unpredictable; the
    `any` guidance above often helps.
-   Unit tests may use `@ts-expect-error`, though they generally should not,
    because it suppresses every error on the line. When testing how an API
    handles unchecked runtime values, prefer a cast to the expected type or
    to `any` with a comment, which confines the suppression to one
    expression, or a documented lint suppression.
-   Google's TypeScript must obey its conformance rules, enforced by the
    public checkers tsetse and tsec, which cover restrictions such as defining
    globals and security patterns such as `eval` or assignments to
    `innerHTML`. Respect whatever conformance or security rules a project
    configures.

This reference adapts the Google TypeScript Style Guide under [CC BY
3.0](https://creativecommons.org/licenses/by/3.0/); see the attribution in the
[skill entrypoint](../SKILL.md).
