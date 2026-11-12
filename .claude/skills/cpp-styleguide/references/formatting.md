# Formatting details

Condensed from the Formatting part of the
[Google C++ Style Guide](https://google.github.io/styleguide/cppguide.html),
checked on 2026-11-03. A configured formatter and established local formatting
take precedence; do not reformat untouched code.

## Contents

-   [Line length](#line-length)
-   [Characters and indentation](#characters-and-indentation)
-   [Declarations and definitions](#declarations-and-definitions)
-   [Function calls and braced lists](#function-calls-and-braced-lists)
-   [Lambdas and floating-point literals](#lambdas-and-floating-point-literals)
-   [Loops, branches, and switches](#loops-branches-and-switches)
-   [Pointers and expressions](#pointers-and-expressions)
-   [Initialization](#initialization)
-   [Preprocessor and class layout](#preprocessor-and-class-layout)
-   [Whitespace](#whitespace)

## Line length

-   Each line holds at most 80 characters.
-   A line may be longer only when it is:
    -   a comment line that cannot be split without hurting readability,
        copy and paste, or auto-linking, such as one holding a long URL or an
        example command;
    -   a string literal that is hard to wrap because it contains URIs or
        other critical pieces, an embedded language, or meaningful newlines
        such as help text;
    -   an `#include` line, a header guard, or a using-declaration.
-   Outside test code, keep such long literals at namespace scope, close to
    the start of the file. If clang-format does not recognize content that
    must not be split, turn the formatter off around it.

## Characters and indentation

-   Keep non-ASCII characters rare and encode them as UTF-8. Do not hard-code
    user-facing text, even English; data-file delimiters and unit-test
    strings are typical legitimate uses.
-   Hex or Unicode escapes are fine, and preferred where they help, such as
    for an invisible character like U+FEFF.
-   Avoid the `u8` prefix when possible: it yields `char8_t` arrays since
    C++20 and changes meaning again in C++23.
-   Do not use `char16_t` or `char32_t`, which are for non-UTF-8 text, or
    `wchar_t` except in code that calls the Windows API.
-   Indent with spaces only, two at a time; set editors to insert spaces for
    the tab key.

## Declarations and definitions

-   Put the return type on the function name's line, and the parameters too
    if they fit.
-   Otherwise, align wrapped parameters with the first one, or break right
    after the open parenthesis and indent the parameters four spaces. The
    body still indents two spaces.
-   If the return type and the name cannot share a line, break between them
    and do not indent the second line.
-   Keep `(` on the name's line with no space before it, and put no spaces
    just inside the parentheses. End the last line of the declaration with a
    space and `{`; put `}` on its own line or on the line with `{`.
-   Choose good parameter names and align parameters where possible. Omit a
    name only for an unused parameter whose purpose is obvious, such as in a
    deleted copy constructor; otherwise comment out the name in the
    definition, as in `void Cache::Evict(int /*reason*/) {}`.
-   Put attributes, including attribute-like macros, at the very start of the
    declaration, before the return type: `[[nodiscard]] bool Flush();`.

## Function calls and braced lists

-   Write a call on one line, wrap its arguments aligned with the first
    argument, or start the arguments on the next line indented four spaces.
    Put no space after `(` or before `)`.
-   Use as few lines as possible, with several arguments per line, unless
    that hurts readability. Then give a complex argument a descriptive
    variable, or put it on its own line with a short comment; decide per
    argument rather than adopting one argument per line as a policy.
-   Arguments with a meaningful layout, such as the rows of a matrix, may be
    formatted to show that layout.
-   Lay out a braced initializer list as you would a function call in its
    position. After a type or variable name, treat the braces as that call's
    parentheses; with nothing before the braces, act as if an empty name
    preceded them.

## Lambdas and floating-point literals

-   Lay out lambda parameters and bodies as for ordinary functions, and
    capture lists as for any comma-separated list. Put no space between `&`
    and a by-reference capture (`[&total]`). A short lambda can sit inline as
    a call argument.
-   Give every floating-point literal a digit on each side of its radix
    point, exponent or not: `2.0f`, `0.25`, and `6.0e23` rather than `2.f`,
    `.25`, or `6e23`.
-   An integer literal may initialize a floating-point variable when the type
    represents that value exactly, but exponential notation never forms an
    integer literal.

## Loops, branches, and switches

-   Separate the keyword, the parenthesized condition or iteration specifier,
    and the controlled statement with one space each rather than line breaks.
-   Inside the parentheses, put no space after `(` or before `)`, and follow
    each `;` with a space or a line break unless `)` or another `;` comes
    next.
-   Put controlled statements in braces, with a line break right after `{`
    and right before `}`; `else` goes on the same line as the preceding `}`.
-   A historical, discouraged exception lets a statement omit the braces, or
    the line breaks inside them, when the whole statement fits on a single
    line (with a space before its body) or across two lines (a break after
    `)` and no braces). It never applies to `if ... else` or `do ... while`,
    suits only brief statements, and some projects always require braces.
-   Write an empty loop body as `{}`, which follows the same line-break
    rules, or as `continue`; never as a lone `;`.
-   `case` blocks may use braces or not. With braces, indent `case` two
    spaces inside the `switch`, the block's statements two more, and the
    closing `}` back at the `case` level.

## Pointers and expressions

-   Put no spaces around `.` or `->`, and none after a unary `*` or `&`.
-   Wherever a pointer or reference type is written (declarations,
    parameters, return types, template arguments), put no space before `*`
    or `&` and one space between the type and any name: `char* name`,
    `const Config& config`, `std::vector<char*>`.
-   Several declarators in one declaration are allowed but unusual, and
    forbidden when any of them is a pointer or reference.
-   When a boolean expression wraps, place its operators consistently, more
    often at line ends, though line starts are allowed. Add parentheses
    judiciously. Use punctuation operators (`&&`, `~`) rather than their
    alternative spellings (`and`, `compl`).
-   Parenthesize a `return` expression only where you would in an
    assignment; neither `return (x);` nor `return(x);` is right.

## Initialization

-   `=`, `()`, and `{}` initialization are all acceptable.
-   Take care with braces on a type that has a `std::initializer_list`
    constructor: a nonempty braced list picks that constructor whenever it
    can, while empty `{}` calls the default constructor if there is one.
    Use parentheses to reach another constructor, as in
    `std::vector<int> v(5, 0)` versus `std::vector<int> v{5, 0}`.
-   Braces reject narrowing conversions between arithmetic types, which can
    catch mistakes.

## Preprocessor and class layout

-   Begin every preprocessor directive in column 0, indented code included.
    Spaces after the `#` of nested directives are allowed but not required.
-   In a class, order the sections `public:`, `protected:`, then `private:`,
    each label indented one space and members two. Keep base classes on the
    line with the class name, within 80 columns. Precede each label except
    the first with a blank line (optional in small classes), and put no blank
    line after a label.
-   Keep a constructor initializer list on the signature's line if it all
    fits. Otherwise break before the `:` and indent four spaces; when the
    list spans several lines, give each member its own line, aligned. The
    closing `{}` may share the last line.
-   Do not indent the contents of namespaces.

## Whitespace

-   Never add trailing whitespace. Remove existing trailing whitespace only
    on lines you are already changing, or in a separate cleanup, since either
    change causes merge work for others.
-   Put two spaces before an end-of-line comment, a space before an opening
    `{`, and usually no space before `;`. Spaces inside the braces of a
    braced-init-list are optional, but use them on both sides or neither.
-   Put spaces around the `:` of base-class and initializer lists, and
    between short inline function bodies and their braces; put none inside
    empty `{}`.
-   Put a space after `if`, `for`, `while`, and `switch`, and around `else`.
    The loop rules above forbid padding inside condition parentheses, while
    the guide's whitespace examples still show it as a rare variant to use
    consistently; keep it only where a file already does.
-   Always put a space after each `;` in a `for` header, and spaces on both
    sides of the `:` in a range-based `for`. Put no space before the colon of
    a `case` label, and one after it when code follows on the same line.
-   Put spaces around assignment operators. Other binary operators usually
    have them, though factors may be written tight, as in `a*b + c`. Put no
    space between a unary operator and its operand, and no padding just
    inside parentheses.
-   Put no spaces inside `<` and `>`, before `<`, or between `>` and `(` in a
    cast, and none between a type and `*` in a template argument.
-   Use blank lines sparingly, like paragraph breaks between closely related
    chunks, and never at a block's first or last line. Within a statement,
    break lines only to stay within the limit or to attach a comment to part
    of it.
