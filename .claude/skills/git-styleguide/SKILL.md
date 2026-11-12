---
name: git-styleguide
description: >-
  Apply the Udacity Git Commit Message Style Guide when writing, suggesting,
  rewording, amending, squashing, or reviewing git commit messages, even when
  no style guide is mentioned. Titles take the form `type: Subject` with one of
  feat, fix, docs, style, refactor, test, or chore; subjects are imperative,
  capitalized, at most 50 characters, and end without a period; an optional
  body explains what and why in lines of at most 72 characters; an optional
  footer references issue tracker IDs. It does not cover branch names, pull
  request descriptions, or Conventional Commits scopes.
---

# Udacity Git commit message style guide

Write commit messages that follow the [Udacity Git Commit Message Style
Guide](https://udacity.github.io/git-styleguide/). Udacity wrote it as the one
convention its students follow and its reviewers grade against; it covers the
commit message only.

A repository's own documented convention (for example Conventional Commits
with scopes, a changeset workflow, or rules in a contributing guide) and
explicit user instructions take precedence. When the convention is unclear,
look at recent history with `git log --oneline`. Drafting a message does not
by itself authorize a commit, amend, rebase, or push.

## Structure

A message has a title, an optional body, and an optional footer, with one blank
line between the parts that are present:

```text
type: Subject

Body

Footer
```

The title is the type, a colon and a space, then the subject.

## Type

Choose exactly one lowercase type:

| Type | Use when the commit |
| --- | --- |
| `feat` | adds a new feature |
| `fix` | corrects a bug |
| `docs` | changes documentation |
| `style` | changes formatting only, such as whitespace or missing semicolons, without changing code |
| `refactor` | restructures production code |
| `test` | adds or reworks tests without changing production code |
| `chore` | updates build tasks, package manager configuration, or similar upkeep without changing production code |

Because `style`, `test`, and `chore` exclude production code changes, a commit
that changes production code is a `feat`, `fix`, or `refactor`.

## Subject

-   Keep it to 50 characters or fewer. The limit is on the subject, the text
    after `type: `; the guide's own sample title has a 49-character subject
    inside a 55-character title.
-   Begin with a capital letter and end without a period.
-   Use the imperative mood: say what the commit does (`Add`, `Fix`,
    `Remove`), not what was done (`Added`) or what it does in the third person
    (`Adds`). A quick check is that the subject completes the sentence "This
    commit will ...".

## Body

-   Optional. Include one only when the change needs explanation or context.
-   Explain what changed and why; the code already shows how.
-   Separate it from the title with one blank line, which is required, and
    keep every line to 72 characters or fewer.
-   Separate paragraphs with blank lines. Short bullets introduced by a hyphen
    or asterisk are fine.

## Footer

-   Optional. Use it to reference issue tracker IDs, placed at the bottom of
    the message, for example `Resolves: #123`.
-   Reference only issues that exist; never invent IDs.

## Workflow

1.  Read what will be committed (`git diff --staged`, or the changes the user
    supplied). If it mixes unrelated purposes, suggest separate commits so
    each one gets an honest type.
2.  Pick the type, write the subject, and count its characters.
3.  Add a body only when a reader would otherwise ask why, or would miss a
    side effect.
4.  From a shell, pass the title and the body as separate `-m` arguments
    (git inserts the blank line between them), or write the message to a file
    and run `git commit -F <file>`. Watch for shell expansion of `$` and
    backticks inside quoted messages.
5.  The guide does not address messages git generates for merges and
    reverts; keep git's defaults unless the project says otherwise.

## Examples

```text
feat: Add CSV export to the reports page
```

```text
fix: Keep sort order after refreshing results

Refreshing reset the table to its default sort, so people lost their
place in long lists. Store the chosen column and direction in the URL
and restore them after each refresh.

Resolves: #214
```

| Draft | Problem | Revised |
| --- | --- | --- |
| `Updated README.` | no type, past tense, final period | `docs: Update installation steps in README` |
| `feat: added dark mode` | past tense, lowercase subject | `feat: Add dark mode` |
| `chore: Simplify price calculation` | production code changed | `refactor: Simplify price calculation` |
| `fix(auth): Handle expired tokens` | scopes are not part of this guide | `fix: Handle expired tokens` |

## Check the message

-   The title is `type: Subject` with one of the seven lowercase types.
-   The subject has at most 50 characters, starts with a capital letter, uses
    the imperative, and has no final period.
-   A body, if present, follows one blank line, wraps at 72 characters, and
    explains what and why.
-   A footer, if present, references real issue tracker IDs.

## Source and attribution

Adapted from the [Udacity Git Commit Message Style
Guide](https://udacity.github.io/git-styleguide/), checked on 2026-11-03 at
udacity/git-styleguide commit `b70c7ab`. The source states no license, so this
skill restates its rules in original wording with original examples and adds
application guidance. It is not an official Udacity publication.
