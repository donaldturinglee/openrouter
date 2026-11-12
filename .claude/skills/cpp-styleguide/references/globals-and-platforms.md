# Globals, libraries, and platforms

Condensed from the
[Google C++ Style Guide](https://google.github.io/styleguide/cppguide.html),
checked on 2026-11-03. The project's configuration and established conventions
still take precedence. Notes marked "Application note" are guidance for
applying the skill, not rules of the guide.

## Contents

-   [Static and global variables](#static-and-global-variables)
-   [Thread-local variables](#thread-local-variables)
-   [Standard and third-party libraries](#standard-and-third-party-libraries)
-   [Nonstandard extensions](#nonstandard-extensions)
-   [Windows code](#windows-code)

## Static and global variables

-   Allow namespace-scope variables, static data members, and function-local
    statics, which all have static storage duration, only when their type is
    trivially destructible: its destructor is neither user-defined nor
    virtual, and every base class and non-static member must itself be
    trivially destructible. Fundamental types, pointers, arrays of such
    types, and `constexpr` variables qualify.
-   The rule also covers a temporary whose lifetime is extended by a static
    reference, such as a global `const std::string&` bound to a function's
    result.
-   References are not objects, so the destructor rule does not apply to
    them, but the initialization rules do; a function-local
    `static Registry& registry = *new Registry;` is fine.
-   Constant initialization, where the initializer is a constant expression
    and any constructor called is `constexpr`, is always allowed. Mark it
    with `constexpr` or `constinit`, and review any unmarked non-local static
    variable as if it were dynamically initialized.
-   Dynamic initialization of non-local variables is generally forbidden. It
    is permitted only when nothing in the program depends on its order
    relative to other initializations, for example caching the process ID in
    a global that no other static initializer reads. Function-local statics
    may be dynamically initialized.
-   Rule of thumb: a global is acceptable if its declaration, considered on
    its own, could be `constexpr`.
-   Common patterns:
    -   For a named string constant, use a `constexpr` `std::string_view`,
        character array, or character pointer that refers to a literal.
    -   For a fixed lookup table or set, use an array of trivial types, such
        as pairs of `int` and `const char*`. Search small tables linearly, or
        keep larger ones sorted and use binary search.
    -   Smart pointers are forbidden as statics because they clean up in their
        destructors; a plain pointer to an object that is never deleted works
        instead.
    -   For constant data of your own type, make the type trivially
        destructible with a `constexpr` constructor.
    -   As a last resort, including when a standard container is really
        wanted, allocate the object once through a pointer or reference held
        in a function-local static, and never delete it.

## Thread-local variables

-   A `thread_local` at namespace or class scope needs an initializer that is
    a genuine compile-time constant, enforced with `constinit` (or, rarely,
    `constexpr`).
-   A `thread_local` inside a function has no initialization-order problem.
    A function or static method returning a reference to one can stand in
    for a namespace-scope variable that needs complex initialization.
-   Every `thread_local` is destroyed when its thread exits, and a destructor
    that reaches another, possibly destroyed, `thread_local` causes a
    use-after-free. Favor trivial types, or types whose destruction provably
    executes no user-written code.
-   Use `thread_local` rather than other mechanisms for per-thread data.

## Standard and third-party libraries

-   Do not use `<ratio>`, `<cfenv>` or `<fenv.h>`, or `<filesystem>`.
-   When choosing a library, first use whatever the codebase already uses for
    that sort of problem. Otherwise prefer, roughly in this order: Abseil; the
    C++ standard library, minus the headers above; first-party libraries the
    codebase already has; then third-party libraries, following the
    codebase's third-party policies.
-   Application note: adding a dependency, Abseil included, is a project
    decision rather than a style fix, and replacing existing uses of a
    disallowed header is a separate, deliberate change.

## Nonstandard extensions

-   Do not use compiler extensions unless something else in the guide allows
    them. Examples: inline assembly, `#pragma`, GCC's `__attribute__`,
    intrinsics (`__builtin_prefetch`, SIMD), `__PRETTY_FUNCTION__`,
    `__COUNTER__`, statement expressions, `alloca()`, variable-length arrays,
    and the `a ?: b` (Elvis) operator.
-   Portability wrappers implemented with extensions are fine when they come
    from a designated project-wide portability header.

## Windows code

-   Windows code follows the same guide as every other platform. Points that
    developers used to Windows conventions often miss:
    -   Do not use Hungarian notation; follow the guide's naming, and give
        source files the `.cc` extension.
    -   Windows type synonyms such as `DWORD` and `HANDLE` are encouraged
        when calling Windows APIs, but keep as near as possible to plain C++
        types, such as `const TCHAR*` instead of `LPCTSTR`.
    -   With Microsoft Visual C++, compile at warning level 3 or above, with
        warnings treated as errors.
    -   Use standard include guards with paths relative to the top of the
        project tree, not `#pragma once`.
    -   Avoid extensions such as `#pragma` and `__declspec` unless absolutely
        necessary. Use `__declspec(dllimport)` and `__declspec(dllexport)`
        only via wrapper macros like `DLLIMPORT` and `DLLEXPORT`, which let
        others switch them off.
    -   `wchar_t` is acceptable in code that calls the Windows API.
-   Rules that may be broken on Windows:
    -   Multiple implementation inheritance is allowed for implementing COM
        and ATL/WTL classes and interfaces.
    -   With ATL, define `_ATL_NO_EXCEPTIONS`. If the standard library cannot
        be built without exceptions, enabling them in the compiler is
        acceptable, but only so the library compiles; still write no
        exception-handling code.
    -   Do not include a precompiled header such as `StdAfx.h` or
        `precompile.h` explicitly, except in `precompile.cc`; rely on the
        `/FI` option to pull it in automatically.
    -   Resource headers, usually `resource.h` and containing only macros,
        are exempt from the guide.
-   Application note: compiler flags, warning levels, and exception settings
    are build decisions; report a mismatch instead of changing them during a
    style edit.
