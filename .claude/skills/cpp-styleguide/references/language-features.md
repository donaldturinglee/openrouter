# Language feature policies

Condensed from the "Other C++ Features" part of the
[Google C++ Style Guide](https://google.github.io/styleguide/cppguide.html),
checked on 2026-11-03. The project's configuration and established conventions
still take precedence. Notes marked "Application note" are guidance for
applying the skill, not rules of the guide.

## Contents

-   [Ownership and smart pointers](#ownership-and-smart-pointers)
-   [Rvalue references and friends](#rvalue-references-and-friends)
-   [Exceptions and noexcept](#exceptions-and-noexcept)
-   [RTTI and casts](#rtti-and-casts)
-   [Streams](#streams)
-   [Constness and constants](#constness-and-constants)
-   [Numeric types and portability](#numeric-types-and-portability)
-   [Macros and small idioms](#macros-and-small-idioms)
-   [Aliases](#aliases)
-   [Switch statements](#switch-statements)

## Ownership and smart pointers

-   Prefer one fixed owner for each dynamically allocated object, ideally the
    code that allocated it. Give other code a copy, or a pointer or reference
    that does not transfer ownership.
-   Make ownership transfer explicit with `std::unique_ptr`: for example, a
    factory returns `std::unique_ptr<Session>` and a consumer takes one by
    value.
-   Do not design for shared ownership without a strong reason, such as
    avoiding expensive copies of an immutable object when the gain is
    significant (`std::shared_ptr<const T>`). When ownership is shared, prefer
    `std::shared_ptr`.
-   Never use `std::auto_ptr`; use `std::unique_ptr` instead.

## Rvalue references and friends

-   Use rvalue references, and `&&` qualifiers on methods, only to:
    -   implement move construction and move assignment;
    -   define `&&`-qualified methods that consume `*this`, leaving it empty
        or unusable (to consume an ordinary parameter, take it by value);
    -   accept forwarding references that are passed on with `std::forward`;
    -   define a `const T&` and `T&&` overload pair when evidence shows it
        beats passing by value, for instance when the input is not always
        consumed.
-   Friend classes and functions are fine within reason. Define them in the
    same file as the class when possible; typical uses are a builder that
    sets up a class's internal state or a unit test. Most classes should still
    interact only through public members.

## Exceptions and noexcept

-   Google C++ code does not use exceptions. The reason is practical, not
    principled: most existing code cannot tolerate them. The ban extends to
    related machinery, including `std::exception_ptr` and
    `std::nested_exception`.
-   The only allowance is for Windows builds whose standard library cannot
    compile with exceptions disabled; even there, write no exception handling
    yourself.
-   Add `noexcept` when it helps performance and truthfully means that an
    exception escaping the function would be a fatal error. Assume that it
    pays off on move constructors; a claimed significant gain on other
    functions warrants discussion with the project's leads.
-   When exceptions are completely disabled, prefer unconditional `noexcept`.
    Otherwise, use simple conditions that turn false only where a throw is
    genuinely possible, such as `std::is_nothrow_move_constructible` checks
    or a test of whether allocation can throw.
-   Favor a simple interface over supporting every throwing case: document
    that a component does not support, say, throwing hash functions, and make
    it unconditionally `noexcept`. Treating allocation failure as fatal is
    often appropriate, and move constructors should throw only for that.
-   Application note: in a project that already uses exceptions, keep its
    error contract; switching error models is a design change, not cleanup.

## RTTI and casts

-   Avoid RTTI (`typeid` and `dynamic_cast`) outside unit tests, where it may
    be used freely, and think twice before adding it to new code.
-   Prefer virtual methods for behavior that depends on the subclass, or a
    double-dispatch design such as the Visitor pattern when the work lives
    outside the object.
-   A `dynamic_cast` is acceptable when program logic guarantees the derived
    type; `absl::down_cast` is usually a better choice where Abseil is
    available.
-   Chains of `typeid` comparisons signal a design problem, and hand-built
    substitutes such as type-tag hierarchies are no better.
-   Do not write C-style casts such as `(int)x`, except casts to `void`, and
    write `T(x)` only when `T` is a class type. Use the first cast that
    correctly applies:
    1.  braces for arithmetic conversions (`int64_t{x}`), which refuse to
        compile when information could be lost;
    2.  a function-style cast to a class type, such as `std::string(view)`;
    3.  `absl::implicit_cast` for an explicit up-cast, for example inside
        `?:`;
    4.  `static_cast` for value conversions, explicit up-casts, and down-casts
        to a type the object is known to have;
    5.  `absl::down_cast` for such down-casts;
    6.  `const_cast` to remove `const`;
    7.  `reinterpret_cast` for unsafe conversions between pointers and
        integers or other pointer types, including `void*`, only with a clear
        grasp of aliasing (consider dereferencing and using `std::bit_cast`);
    8.  `std::bit_cast` to reinterpret a value's bits as another type of the
        same size.
-   Application note: without Abseil, `static_cast` covers the up-cast and
    down-cast cases.

## Streams

-   Use streams only when they are the best tool, typically for ad hoc,
    local, human-readable output aimed at developers. Follow the code around
    you: logging libraries beat `std::cerr` and `std::clog` for diagnostics,
    and string-formatting libraries beat `std::stringstream`.
-   Keep streams away from user-facing I/O and from untrusted input; reach
    for templating libraries that take care of internationalization,
    localization, and security hardening instead.
-   Apart from error state, leave the stateful parts of streams alone:
    `imbue()`, `xalloc()`, `register_callback()`, and the like. Control base,
    precision, and padding with explicit formatting functions rather than
    manipulators or format flags.
-   Overload `<<` only for types that represent values, printing a
    human-readable form of the value without implementation details. Expose
    internals for debugging through a named function, conventionally
    `DebugString()`.

## Constness and constants

-   Mark parameters, methods, and non-local variables `const` in APIs
    whenever doing so is accurate and tells the reader something.
-   Take arguments a function will not modify as `const T&` or `const T*`.
    Leave `const` off by-value parameters in declarations, where it does
    nothing for callers.
-   Make methods `const` unless they change logical state, let callers change
    it (such as by returning a non-`const` reference, which is rare), or
    cannot safely run concurrently. All `const` operations of a class should
    be safe to call concurrently; otherwise document the class as
    thread-unsafe.
-   `const` on local variables is neither encouraged nor discouraged. Writing
    `const int*` rather than `int const*` is encouraged but not required;
    match the surrounding code.
-   Use `constexpr` for true constants and the functions that define them,
    `constinit` to guarantee constant initialization of non-constant
    variables, and `consteval` for code that must never run at run time.
    Do not contort a function to make it `constexpr`, and do not use
    `constexpr` or `consteval` to force inlining.

## Numeric types and portability

-   Among the built-in integer types, use only `int`, assuming at least 32
    bits but no more. Otherwise use exact-width types from `<stdint.h>`, such
    as `int16_t` or `int64_t`, instead of `short`, `long`, `long long`, or
    `unsigned long long`; `size_t` and `ptrdiff_t` are fine where appropriate.
    Write these type names without `std::`.
-   Pick `int64_t` or another 64-bit type for any value that might ever reach
    2^31, and allow for larger intermediate results; when in doubt, choose the
    larger type. A container's size type must fit every possible use.
-   Use unsigned types only for bit patterns or for arithmetic that must wrap
    modulo 2^N. Never use one just to say a value is non-negative; assert that
    instead. Avoid mixing signedness, and prefer iterators and containers to
    pointers and sizes.
-   Convert between integer types with care, since integer conversions and
    promotions may lead to undefined behavior and security bugs.
-   Use only `float` and `double`, which may be assumed to be IEEE-754
    binary32 and binary64. Never use `long double`; its results are not
    portable.
-   Do not depend on one processor's features. Print values with type-safe
    formatting such as `absl::StrCat`, `absl::Substitute`, `absl::StrFormat`,
    or `std::ostream` rather than the `printf` family. Serialize structured
    data that crosses the process boundary with a library such as Protocol
    Buffers instead of copying its memory. Store addresses as `uintptr_t`, and
    build 64-bit constants with braces, as in `uint64_t{1} << 40`.

## Macros and small idioms

-   Avoid defining macros, above all in headers. Use inline functions for
    speed, `const` variables or enums for constants, and references for short
    names; avoid conditional compilation apart from header guards.
-   Never use macros to declare parts of a C++ API, public or not; that needs
    a waiver from the project's leads.
-   When a macro is unavoidable, do not define it in a `.h` file. `#define` it
    just before use and `#undef` it right after, choose a likely unique name
    instead of `#undef`ing an existing macro, avoid expansions that leave
    constructs unbalanced (or document them), and prefer not to build names
    with `##`.
-   Exporting a macro from a header is extremely strongly discouraged. If it
    happens, prefix the name with the project's namespace in capitals so it
    is globally unique.
-   Use `nullptr` for null pointers and `'\0'` for the null character, never
    the literal `0`.
-   Prefer `sizeof(variable)` to `sizeof(Type)`; the type form suits code not
    tied to a particular variable, such as handling a data format.
-   Use prefix `++i` and `--i` unless the code needs the postfix result.

## Aliases

-   Prefer `using` to `typedef` in new code. `using enum E;` aliases all of
    an enumeration's enumerators.
-   An alias in a header is public API unless it sits in a function body, a
    `private` section, or an explicitly internal namespace. Clients cannot
    reach aliases in those places or in `.cc` files, so local convenience
    aliases are fine there.
-   Add a public alias only when clients are meant to use it, never just to
    shorten the implementation. Document whether it is guaranteed to stay
    identical to its target or promises only narrower compatibility.
-   Keep namespace aliases out of public APIs.

## Switch statements

-   Give every `switch` on a non-enum value a `default` case; for enums,
    rely on compiler warnings about unhandled values. If `default` should be
    impossible, treat reaching it as an error.
-   Annotate each fall-through with `[[fallthrough]];` at the point where
    control falls into the next label. Consecutive labels with no code
    between them need no annotation.
