---
name: shell-styleguide
description: >-
  Apply the Google Shell Style Guide when writing, editing, refactoring, or
  reviewing Bash scripts, sourced Bash libraries, and Bash snippets, even when
  no style guide is mentioned. Covers when to use shell, the bash shebang and
  file extensions, error output, file and function comments, formatting
  (2-space indentation, 80-column lines, pipelines, control flow, case),
  quoting and variable expansion, ShellCheck, command substitution, [[ ]]
  tests, arrays, arithmetic, naming, local variables, main, and return-value
  checks. It is a Bash guide: check the shebang or interpreter first, and do
  not apply it to POSIX sh-only scripts (such as #!/bin/sh, dash, or BusyBox
  ash), zsh or fish, PowerShell, or Windows batch and cmd files.
license: CC-BY-3.0
---

# Google shell style guide

Apply the [Google Shell Style
Guide](https://google.github.io/styleguide/shellguide.html) to Bash
executables, sourced Bash libraries, and Bash snippets. Despite its title it is
a Bash guide: Bash is the only shell it permits for executables, so it uses
Bash features freely and does not aim for POSIX compatibility. Its one
exception is a target that forces another shell, such as a legacy or
constrained system that needs plain Bourne shell.

Check the interpreter first: the shebang, how the file is run (`bash`, `sh`,
`source`, CI steps, packaging hooks), and whether another shell sources it.
Leave POSIX `sh`, dash, BusyBox, zsh, fish, PowerShell, and batch files to
their own conventions; do not convert them to Bash or add Bash features as
style cleanup. In Bash files, respect the oldest Bash version the project
supports; the guide notes, for example, that `readarray` needs Bash 4.

Explicit user instructions, the project's own configuration (ShellCheck
settings, formatter, supported platforms and Bash version, CI), and established
local conventions take precedence. The guide itself says to keep the existing
style of a file being modified, and it requires its formatting rules for new
code. Do not migrate toolchains, mass-reformat, or rename functions that other
code calls merely to apply the guide; keep style-only cleanup separate from
behavior changes, and explain material deviations. Quoting, `local`, `set`, and
arithmetic edits can change behavior, so test them like any other change.

## When to use shell

-   Use shell only for small utilities and simple wrapper scripts that mostly
    call other programs and manipulate little data. When performance matters,
    use another language.
-   A script longer than 100 lines, or with non-straightforward control flow,
    should be rewritten in a more structured language now, before it grows;
    judge complexity by whether people other than the author can maintain it.
    The guide points to Google's [Deshell
    Playbook](https://github.com/google/deshell/blob/main/playbook.md) for
    migrations. In an editing task, recommend such a rewrite rather than
    doing it unasked.

## Files and invocation

-   Executables start with `#!/bin/bash` and minimal flags. Set shell options
    with `set` inside the script, so that running it as `bash script_name`
    keeps the same behavior.
-   Executables have a `.sh` extension or none. Prefer `.sh` when a build rule
    renames the file (source `foo.sh`, target `foo`), and no extension for a
    command installed directly on users' `PATH`; otherwise either is fine.
    Libraries must end in `.sh` and should not be executable.
-   Never make a shell script SUID or SGID; use `sudo` for elevated access.
-   Name source files in lowercase, optionally separating words with
    underscores (`make_template` or `maketemplate`, never `make-template`).
-   If a project deliberately uses `#!/usr/bin/env bash`, for hosts without
    `/bin/bash`, keep it and note the deviation rather than changing it.

## Output and comments

-   Send all error messages to STDERR; a small helper that prints them to
    `>&2` with a timestamp or other status information is recommended.
-   Begin every file, after the shebang, with a top-level comment giving a
    brief overview of its contents. Copyright and author lines are optional.
-   Comment tricky, non-obvious, interesting, or important code, but do not
    comment everything.
-   Write TODOs as `TODO(name): description`, naming the person (or e-mail or
    other identifier) with the best context, usually yourself. The format is
    for searching; it does not commit that person to fixing the problem.
-   Every function needs a header comment unless it is both obvious and
    short, and every library function needs one regardless of size. It
    covers the API well enough that callers need not read the code: a
    description, then as applicable `Globals:` (used and modified),
    `Arguments:`, `Outputs:` (to STDOUT or STDERR), and `Returns:` (values
    other than the last command's exit status). The guide's examples frame
    each header with lines of `#`.

```bash
#######################################
# Copy a release archive to the mirror.
# Globals:
#   MIRROR_ROOT
# Arguments:
#   Path to the archive.
# Outputs:
#   Writes the mirrored path to STDOUT.
# Returns:
#   0 on success, non-zero if the copy fails.
#######################################
publish_archive() {
  local -r archive="$1"
  cp -- "${archive}" "${MIRROR_ROOT}/" || return
  echo "${MIRROR_ROOT}/${archive##*/}"
}
```

## Formatting

-   Indent 2 spaces and never use tabs, except in the body of a `<<-`
    here-document, which relies on tab indentation. In existing files, keep
    the existing indentation. Separate blocks with blank lines.
-   Keep lines to 80 characters. Write longer literal text as a here-document
    or a string with embedded newlines. A word that cannot sensibly be split,
    such as a path or URL, may run long, but put it on a line of its own or in
    a variable, and wrap the rest of the line normally.
-   Keep a pipeline on one line when it fits. Otherwise put one segment per
    line: end each line with `\`, and begin the next with the `|`, `||`, or
    `&&` operator, indented 2 spaces. Put comments before the whole pipeline,
    and move complex details into a helper function.
-   Keep `; then` and `; do` on the line that opens the `if`, `for`, `while`,
    `until`, or `select`. Put `else` on its own line, and `fi` or `done` on
    its own line aligned with the opening keyword.
-   Write `for arg in "$@"` rather than omitting `in "$@"`. In a function,
    declare the loop variable `local` so it does not leak out.
-   In `case`, indent patterns 2 spaces from `case` and `esac`, and multi-line
    actions one level further. Give a long or multi-command alternative
    separate lines for the pattern, the actions, and `;;`. A simple
    alternative may share one line if it stays readable, as is common in
    option parsing, with a space after `)` and before `;;`. Patterns
    generally need no quoting and take no leading `(`; avoid `;&` and `;;&`.

## Quoting and expansion

-   These apply in priority order: match the existing code, quote variables,
    and prefer `"${var}"` to `"$var"`. The guide calls them strong
    recommendations rather than mandatory rules.
-   Do not brace single-character specials and positional parameters (`$1`,
    `$?`, `$#`, `$@`) unless braces are required (`${10}`) or avoid confusion
    (`"${1}0"`); prefer braces on every other variable. Braces are not
    quoting, so the double quotes are still needed.
-   Quote strings that contain variables, command substitutions, spaces, or
    shell metacharacters, unless an unquoted expansion is deliberately
    required or the value is a shell-internal integer. Single quotes signal
    that no substitution is wanted; double quotes allow it.
-   Quoting `$?`, `$#`, `$$`, and `$!` is optional, but quote named internal
    integers such as `PPID` for consistency. Quote command substitutions even
    when they produce integers; do not quote literal integers. Quoting plain
    words is preferred; command options and path names need not be quoted.
-   Pass arguments on with `"$@"`. Use `$*` only for a specific reason, such
    as joining the arguments into a log message.
-   Use `$(command)`, never backticks, and avoid `eval`.
-   Expand wildcards with an explicit path, `./*` rather than `*`, so that
    filenames beginning with `-` are not taken as options.

## Tests and arithmetic

-   Prefer `[[ ... ]]` to `[ ... ]`, `test`, and `/usr/bin/[`. It performs no
    word splitting or pathname expansion and supports pattern and regular
    expression matching. Leave a regex on the right of `=~` unquoted; a
    quoted right side of `==` matches literally.
-   Test for empty or non-empty strings with `-z` and `-n`, not with filler
    characters (`"${var}X"`) or a bare `[[ "${var}" ]]`. Comparing with an
    empty string works but is not preferred.
-   Use `==` rather than `=` for string equality. Inside `[[ ... ]]`, `<` and
    `>` compare lexicographically, so use `(( ... ))` (preferred) or `-lt` and
    `-gt` for numbers.
-   Do arithmetic with `(( ... ))` or `$(( ... ))`, never `let`, `$[ ... ]`,
    or `expr`. Variables inside need no `$` or braces (a recommendation), and
    integer variables are best declared with `local -i` or `declare -i`.
-   Avoid standalone `(( ... ))` statements, or watch for results of zero:
    with `set -e`, `(( i++ ))` exits the shell when `i` is 0.

## Arrays and command output

-   Store lists, especially command-line arguments, in arrays and expand them
    as `"${array[@]}"`. Do not pack several arguments into one string, which
    leads to `eval` or nested quoting, and do not fill an array from an
    unquoted command substitution such as `$(ls)`. Arrays are not for complex
    data structures; needing those means the task has outgrown shell.
-   Do not pipe into `while`, whose subshell loses variable changes. Use
    process substitution (`done < <(command)`), or read the lines with
    `readarray -t lines < <(command)` (Bash 4 or later) and loop over them.
-   Be careful with `for item in $(command)`, which splits output on
    whitespace rather than lines; prefer `while read` or `readarray` unless
    the output is known to be safe.

## Naming and structure

| Entity | Convention |
| --- | --- |
| Functions | Lowercase with underscores, such as `sync_mirror`; library functions may add a `package::` prefix, except where colon-delimited names work poorly, such as interactive completion |
| Variables | As for functions; name a loop variable after the items it iterates |
| Constants and exported variables | Uppercase with underscores, such as `MIRROR_ROOT`, declared at the top of the file |
| Source files | Lowercase, underscores optional, no dashes |

-   Follow a function name with `()`, no space between, and keep the opening
    brace on the same line. The `function` keyword is optional but must be
    used consistently across a project.
-   Prefer `readonly` and `export` to the equivalent `declare` options. A
    constant computed at runtime or in a conditional must be made `readonly`
    immediately afterwards.
-   Declare function variables with `local`. When the value comes from a
    command substitution, declare and assign in separate statements, because
    `local` does not pass on the substitution's exit status.
-   Put all functions together near the top of the file, just below the
    constants. Only includes, `set` statements, and constants may come before
    them, and no executable code may hide between them.
-   Any script that defines at least one other function needs a `main`
    function, defined last, with `main "$@"` as the last non-comment line.
    Short scripts with a linear flow do not need one.

## Calling commands

-   Always check return values and return informative statuses. Test a single
    command directly (`if ! command; then`) or check `$?` right after it.
-   For pipelines, use `PIPESTATUS`. Check its elements directly when only
    overall success matters; when the reaction depends on which stage failed,
    copy it into an array immediately, since any later command, including
    `[`, overwrites it.
-   Prefer builtins and parameter expansion to external processes: for
    example, `${var/#old/new}` instead of piping through `sed`, `=~` with
    `BASH_REMATCH` for extraction, and `$(( ))` instead of `expr`. Avoid
    aliases in scripts; functions can do everything aliases do.

## Check the change

Run the project's configured checks and the tests that cover the change. The
guide recommends [ShellCheck](https://www.shellcheck.net/) for every script:
use the project's ShellCheck setup, or run it as an option when nothing is
configured, without adding tooling solely for this skill. `bash -n` catches
syntax errors, not behavior changes, so exercise changed paths, including
failures, under the options the script really uses, such as `set -e`. Keep
executables executable, libraries not, and line endings LF. For a review-only
request, report each finding with its location, the rule, and a minimal fix,
without editing files.

## Source and attribution

Adapted and condensed from the [Google Shell Style
Guide](https://google.github.io/styleguide/shellguide.html), checked on
2026-11-03 at commit `ab89e73` of the gh-pages branch of
[google/styleguide](https://github.com/google/styleguide). This skill
condenses and reorganizes the guide and adds application guidance; it is not
an official Google publication. Google's guides are licensed under [CC BY
3.0](https://creativecommons.org/licenses/by/3.0/), and their code samples
under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0).
