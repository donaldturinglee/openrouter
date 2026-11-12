---
name: cpp-styleguide
description: >-
  Apply the Google C++ Style Guide when writing, editing, refactoring,
  formatting, or reviewing C++ source files, headers, and tests, even when no
  style guide is mentioned. Covers the C++20 target, self-contained headers and
  include order, namespaces and linkage, classes, functions, naming, comments,
  and formatting, with references for exceptions, RTTI, casts, integer types,
  type deduction, lambdas, templates and concepts, macros, static storage,
  library choice, and Windows code. C++ only: do not apply it to C, C#, or
  Objective-C, and confirm that a .h file holds C++ before applying it. In
  Objective-C++ files, apply it only to C++ classes and functions and leave
  Objective-C code to objective-c-styleguide.
license: CC-BY-3.0
---

# Google C++ style guide

Apply the
[Google C++ Style Guide](https://google.github.io/styleguide/cppguide.html) to
C++ you write or change. It targets C++20 (no C++23 features, with the target
advancing over time), bans nonstandard compiler extensions, and asks for a
portability check before relying on C++17 or C++20 features. It covers `.cc`
sources, `.h` headers, and rare `.inc` files; it recommends cpplint but
mandates no formatter.

User instructions, project configuration (`.clang-format`, linters, compiler
flags and language standard, exception policy, framework contracts), and
established local conventions take precedence; the guide itself lets
nonconforming code stay locally consistent. Do not migrate toolchains,
mass-reformat, or rename public APIs just to apply it; keep style-only cleanup
apart from behavior changes and explain material deviations. Abseil and other
Google tools are not prerequisites: use an Abseil facility the guide names only
if the project already depends on Abseil. The guide's snippets illustrate
rules; they are not templates.

-   Read [language features](references/language-features.md) when code
    touches ownership, rvalue references, friends, exceptions, RTTI, casts,
    streams, `const`, numeric types, macros, aliases, or `switch`.
-   Read [deduction and templates](references/deduction-and-templates.md) when
    code uses `auto`, CTAD, structured bindings, designated initializers,
    lambdas, templates, concepts, modules, or coroutines.
-   Read [globals and platforms](references/globals-and-platforms.md) when
    code adds static or `thread_local` variables, picks libraries, uses
    compiler extensions, or targets Windows.
-   Read [formatting](references/formatting.md) when no formatter is
    configured or a review needs wrapping, brace, or whitespace details.

## Header files

-   Pair each `.cc` file with a `.h`; unit tests and small `main()`-only
    files are common exceptions. Make headers self-contained: compilable
    alone, guarded, and including what they need. A file meant for textual
    inclusion mid-file ends in `.inc`; keep such files rare.
-   Name guards `<PROJECT>_<PATH>_<FILE>_H_` from the path in the project's
    source tree (`acme/src/net/socket.h` gets `ACME_NET_SOCKET_H_`); do not
    use `#pragma once`.
-   Include what you use: include a header that declares each symbol you
    reference, even when another include already brings it in, and nothing
    else. Avoid forward declarations and never forward declare another
    project's entities (in `std` that is undefined behavior); for your own,
    first try making the header cheap to include.
-   Write a body at a function's public declaration only if it is about 10
    lines or fewer. Longer bodies go in the `.cc` unless the header needs
    them, and then in an internal part: the `private` section, an `internal`
    namespace, or below an implementation-details comment. Keep header
    definitions ODR-safe, and never split template or inline definitions into
    a separate `-inl.h` file; a template instantiated in only one `.cc` may
    stay there.
-   Include project headers by source-tree path without `.` or `..`; use angle
    brackets only where required (standard and system headers, rare
    third-party cases). Order groups, separated by blank lines and alphabetized
    within: related header; C system and other angle-bracket `.h` headers;
    C++ standard headers; other libraries; this project. Conditional
    system-specific includes may come last.

## Scoping

-   Wrap a file's code, after includes and flag or forward declarations, in a
    namespace named uniquely for the project. Do not indent its contents,
    close it with `}  // namespace name` (`}  // namespace` when unnamed), and
    prefer `namespace a::b {` nesting in new code.
-   Never use using-directives, inline namespaces, or declarations in `std`.
    Keep namespace aliases out of header namespace scope unless that namespace
    is explicitly internal, and make internal namespaces unique per library,
    such as `acme::internal_socket`.
-   Give `.cc`-only definitions internal linkage (unnamed namespace or
    `static`), never in headers. Prefer namespaced free functions to global
    ones and to classes that only hold static members.
-   Declare locals in the narrowest scope near first use and initialize them
    in the declaration, including variables of `if`, `while`, and `for`
    headers; hoisting an expensive object out of a loop is fine.
-   Objects with static storage duration must be trivially destructible (a
    global passes if it could be `constexpr`), so no global `std::string`,
    containers, or smart pointers. Mark constant initialization `constexpr` or
    `constinit`; nonlocal dynamic initialization must not depend on ordering.

## Classes

-   Never call virtual functions in constructors, and avoid work there that
    can fail without a way to report it; terminate if appropriate, or use a
    factory function or `Init()` method.
-   Mark conversion operators and constructors callable with one argument
    `explicit`, except copy and move constructors and constructors taking a
    single `std::initializer_list`; other implicit conversions need a waiver.
-   State copyability in the `public` section: declare the copy operations of
    a copyable class, the move operations of a move-only class, and delete the
    copy operations otherwise. An assignment operator needs its constructor,
    and declaring one copy (or move) operation requires its partner. Omit them
    only when obvious: no `private` section, or a clearly uncopyable base.
-   Add moves to a copyable type only when much cheaper than copies, and
    review defaulted operations. Avoid slicing with abstract bases, and avoid
    deriving from concrete classes.
-   Use `struct` only for passive data with public fields and no cross-field
    invariants; otherwise, or when in doubt, use `class`. Prefer structs with
    named fields to pairs and tuples outside generic code.
-   Prefer composition. Inheritance is `public` and is-a only; mark each
    override with exactly one of `override` or `final`, without `virtual`;
    inheriting from several implementations is strongly discouraged.
-   Overload operators only for your own types, defined beside them, with
    conventional meanings and consistent related operators. Prefer nonmember
    non-modifying binary operators. Define a documented nonmember
    `operator==`, add `operator<=>` only for one obvious ordering, and prefer
    leaving the other comparisons alone. Never overload `&&`, `||`, comma,
    or unary `&`, and never define or use user-defined literals, standard
    ones included.
-   Keep data members `private` unless constant; Google Test fixtures defined
    in a `.cc` file may use `protected` ones.
-   Order sections `public`, `protected`, `private`. Within each, prefer types
    and aliases, non-static data members (structs only), static constants,
    factory functions, constructors and assignment, the destructor, other
    functions, then other data members. Keep large bodies out of the class.

## Functions

-   Prefer return values to output parameters; return by value, else by
    reference, and return a raw pointer only when it can be null.
-   Take required inputs by value or `const` reference, and required outputs
    and in/out parameters by reference. Use `std::optional` for optional
    by-value inputs, a pointer to `const` for other optional inputs, and a
    non-`const` pointer for optional outputs. Avoid APIs where a reference
    parameter must stay valid after the call returns; copy the value, or take
    a pointer and document how long it must live and that it is non-null.
-   Put inputs before outputs, including new parameters; this is not absolute.
-   Keep functions focused; past about 40 lines, consider splitting them.
-   Overload only when callers need not know which overload runs; one umbrella
    comment documents the set. Never put default arguments on virtual
    functions or use defaults whose value can vary; when in doubt, overload.
-   Use leading return types; trailing ones only where required or far clearer.

## Naming

| Entity | Convention | Example |
| --- | --- | --- |
| Files | lowercase with `_` or `-` as the project does; `_` if no pattern | `socket_pool.cc` |
| Types, aliases, enums, type template parameters, concepts | `PascalCase`, no underscores | `SocketPool` |
| Variables, parameters, struct data members | `snake_case` | `idle_count` |
| Class data members, static or not | `snake_case_` | `idle_count_` |
| Constants fixed for the whole program, enumerators | `k` then `PascalCase` | `kMaxIdle` |
| Functions | `PascalCase`; accessors and mutators may be `snake_case` | `Acquire()`, `set_limit()` |
| Namespaces | `snake_case` | `socket_util` |
| Macros, if unavoidable | `UPPER_SNAKE_CASE` with a project prefix | `ACME_CHECK_FD` |

-   Pick names a reader from another team understands; scale detail with the
    name's visibility and skip what context already says. Avoid abbreviations
    unknown outside the project, never drop letters inside a word, and treat
    an abbreviation as one word (`LoadUrl()`, not `LoadURL()`); `i` and `T`
    are fine.
-   Every constant with static storage duration, including static constant
    members, gets a `k` name. Locals may use one, but never for a value that
    differs between calls. API constants meant to look like functions use
    function names; non-type template parameters follow variable or constant
    rules.
-   Make top-level namespaces globally unique and owned by one project or
    team; nested ones avoid well-known names such as `std` and `absl`.
-   Make file names specific (`order_queue_metrics.h`, not `metrics.h`),
    avoid names found in `/usr/include`, and name tests `*_test.cc`.
-   Names that mirror an existing C, C++, or interop Rust entity may follow its
    convention, as STL-like containers do.
-   Use inclusive, gender-neutral language in names and comments.

## Comments

-   Use `//` (far more common) or `/* */` consistently, as readable prose with
    proper capitalization, punctuation, and spelling.
-   Start files with the project's license boilerplate; new files usually get
    no copyright notice or author line. A file declaring several user-facing
    abstractions gets a comment describing the collection.
-   Document each non-obvious class or struct: purpose, usage, and threading
    or synchronization assumptions; a short usage example often helps.
-   Comment almost every function declaration, private and `.cc`-local ones
    included, unless simple and obvious. Start with a verb phrase ("Returns
    the next token") and cover inputs and outputs, retained pointer or
    reference arguments, whether pointers may be null and what null does,
    whether outputs are appended or overwritten, and performance costs.
    Overrides document only what they add; constructors and destructors
    document ownership and cleanup.
-   At definitions, explain tricky choices instead of repeating the
    declaration comment. Document non-obvious member invariants and sentinel
    values, and say what every global variable is for.
-   Explain why, not what; prefer self-describing code. Clarify call arguments
    with named constants, enums instead of `bool`s, options structs, or named
    variables before resorting to `/*name=*/` comments.
-   Write `TODO` in capitals followed by an issue ID, name, or e-mail with the
    best context, as in `// TODO(issue 4512): ...`; deferred TODOs name a
    specific date or event.

## Formatting essentials

-   Lines hold at most 80 characters, except unsplittable comment lines (long
    URLs or commands) and string literals, `#include` lines, header guards,
    and using-declarations.
-   Indent two spaces, never tabs; continuation lines indent four spaces or
    align after the opening parenthesis.
-   Keep return type, name, and `(` together and end the signature with ` {`;
    if return type and name do not fit, break between them without indenting.
-   Brace controlled statements and write `} else {`; the discouraged
    braceless one- or two-line form never applies to `if ... else` or
    `do ... while`. Empty loop bodies are `{}` or `continue`, never `;`.
-   Write `if (x)` with no padding inside the parentheses. Attach `*` and `&`
    to the type (`const Widget& widget`), and never mix pointer or reference
    declarators with others in one declaration.
-   Indent access labels one space and members two; break long constructor
    initializer lists before `:` with four spaces; do not indent namespace
    contents; start preprocessor directives at column 0.
-   Add no trailing whitespace, few blank lines (none at block edges), and
    digits on both sides of a floating-point radix point (`1.0f`, `3.0e8`).

## Check the change

-   Run the project's configured formatter, linters, warnings, build, and
    relevant tests. If nothing is configured, the guide's own pointers are
    options: [cpplint](https://github.com/cpplint/cpplint) (expect false
    positives and negatives), clang-format's built-in `Google` style, and the
    guide's Emacs settings file. Do not add tooling solely for this skill.
-   Formatting and linting do not prove correctness. After header or interface
    changes, check direct includes and affected consumers; after ownership or
    lifetime changes, check moves, captures, and cleanup paths.
-   For a review-only request, report findings (location, rule, minimal fix)
    without editing files, and say whether each is a hard rule, a preference,
    or a documented exception.

## Source and attribution

Adapted and condensed from the
[Google C++ Style Guide](https://google.github.io/styleguide/cppguide.html),
checked on 2026-11-03 at commit `ab89e73` of the `gh-pages` branch of
[google/styleguide](https://github.com/google/styleguide). This skill
condenses and reorganizes the guide and adds its own application guidance
(precedence, verification, and review notes); it is not an official Google
publication, and its examples are original. The guide is licensed under
[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/); the repository's
code samples are licensed under
[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0).
