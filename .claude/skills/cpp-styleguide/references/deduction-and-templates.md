# Type deduction, lambdas, and templates

Condensed from the
[Google C++ Style Guide](https://google.github.io/styleguide/cppguide.html),
checked on 2026-11-03. The project's configured language standard and
conventions still take precedence. Notes marked "Application note" are
guidance for applying the skill, not rules of the guide.

## Contents

-   [Type deduction](#type-deduction)
-   [Class template argument deduction](#class-template-argument-deduction)
-   [Designated initializers](#designated-initializers)
-   [Lambda expressions](#lambda-expressions)
-   [Template metaprogramming](#template-metaprogramming)
-   [Concepts and constraints](#concepts-and-constraints)
-   [Modules and coroutines](#modules-and-coroutines)

## Type deduction

-   Deduce a type only when that makes the code clearer or safer for readers
    outside the project, never merely to avoid writing the type. Types that
    feel like clutter to the author often inform other readers: the result of
    `std::make_unique<T>()` is obvious, but a project factory's usually is
    not.
-   Deducing function template arguments is nearly always fine.
-   For local variables, `auto` may omit types that are obvious or beside the
    point, such as an iterator type or a `std::make_unique` result. Keep the
    informative part explicit, for instance by binding the element an
    iterator refers to with its real type.
-   CTAD that only removes template-argument boilerplate rarely adds value.
    For elements of map-like containers, structured bindings are usually
    clearer than one variable holding the pair. Avoid `decltype(auto)` when
    something simpler works.
-   Deduce return types, for functions or lambdas, only when the body is small
    with very few `return` statements and the scope is narrow. Public
    functions in headers should almost never do it, because the
    implementation then becomes the interface.
-   Avoid deducing parameter types (with `auto` or template parameters) when
    a specific type works. A parameter used with only one type should name it
    unless the caller sits right next to the definition or the function is a
    lambda handed to a well-known interface.
-   Never use `auto` parameters on non-lambda functions; write a named
    template parameter so the template is visible. In a lambda that needs a
    parameter's type, declare a template parameter (`[]<typename T>(T value)`)
    instead of applying `decltype` to an `auto` parameter.
-   Structured bindings can add information through well-chosen names,
    especially for pairs, tuples, and map elements, where they also avoid
    accidental copies from forgetting `const` on the key type. Use pairs and
    tuples only where an existing API forces them.
-   When binding names differ from a struct's field names, record each field
    name in a comment before its binding, using the `/*field=*/` form of
    argument comments so tools can check the order.

## Class template argument deduction

-   Use CTAD only with templates whose maintainers opted in with at least one
    explicit deduction guide; every template in `std` counts as opted in.
    Enforce this with a compiler warning where one exists.
-   Uses of CTAD must also satisfy the type deduction rules above.

## Designated initializers

-   Use only the form C++20 allows: designators listed in field-declaration
    order, with any skipped fields initialized as in ordinary aggregate
    initialization. Do not rely on C or compiler-extension forms that permit
    other orders.

## Lambda expressions

-   Use lambdas where appropriate, formatted like other functions.
-   Prefer explicit captures whenever the lambda might outlive the current
    scope, so that reference captures, and any use of `this`, are visible.
-   Use the `[&]` default only when the lambda clearly ends before anything it
    could capture.
-   Use the `[=]` default only to bind a few obvious variables in a short
    lambda, and never where it would capture `this` implicitly: a lambda in a
    non-static member function that uses members must capture `this`
    explicitly or through `[&]`. Avoid long or complex lambdas with `[=]`.
-   Capture only variables that already exist in the enclosing scope. Do not
    use init captures to create new names or to alter what an existing name
    means in a substantial way; declare an ordinary variable and capture it,
    or write a named function object.
-   Lambda parameter and return types follow the type deduction rules above.

## Template metaprogramming

-   Avoid intricate template programming. It pays off mainly in a few
    low-level components whose maintenance cost is spread over many uses, and
    it should stay understandable to the team members who will maintain it.
-   Warning signs that it has gone too far: recursive instantiation, type
    lists, metafunctions, expression templates, SFINAE, or `sizeof` tricks to
    detect overload resolution.
-   When it is needed, minimize and isolate the complexity, hide it behind
    readable user-facing headers, comment tricky code heavily, and document
    how to use it and sketch the code it generates.
-   Treat compiler error messages as part of the interface: adjust the code
    until mistakes produce understandable, actionable errors.

## Concepts and constraints

-   Use concepts and constraints sparingly, only where code before C++20
    would have used templates and their legacy equivalents.
-   Prefer standard concepts to equivalent type traits (`std::integral` over
    `std::is_integral_v`), and never re-implement an existing concept or
    trait by hand.
-   Write constraints with `requires(Concept<T>)` syntax. Avoid the
    `template <Concept T>` form and legacy constructs such as
    `std::enable_if`; constraints are preferred over template
    metaprogramming.
-   Define new concepts rarely, internal to a library and not exposed at API
    boundaries; keep them out of headers that are not marked internal.
-   Skip concepts that merely repeat the function body or state requirements
    already obvious from the body or the error messages. Keep a plain
    template unless constraints bring a demonstrable gain, such as clearer
    errors when a requirement is deeply nested or subtle.
-   Use only concepts the compiler can verify. Express semantic or otherwise
    unenforced requirements through comments, assertions, or tests.

## Modules and coroutines

-   Do not use C++20 modules.
-   Use C++20 coroutines only through libraries that the project's leads have
    approved for project-wide use, and never write your own promise or
    awaitable types.
-   Application note: when the project has no approved coroutine library,
    ask before introducing coroutines.
