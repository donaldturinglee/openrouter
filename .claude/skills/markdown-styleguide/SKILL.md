---
name: markdown-styleguide
description: >-
  Apply Google's Markdown style guide when writing, editing, formatting, or
  reviewing Markdown files kept in a repository, such as README files, docs,
  guides, and skill files, even when no style guide is mentioned. Covers
  document layout, a single H1, ATX headings with unique names, the
  80-character line limit and its exceptions, trailing whitespace and line
  breaks, list numbering and indentation, inline code and fenced code blocks
  with a declared language, link paths, link text, reference links, images,
  tables, and avoiding HTML, plus Google's documentation practices for
  README files and keeping docs fresh. Not for chat replies, commit
  messages, or code comments and docstrings. Preserve the target renderer's
  requirements, required front matter, working links, and the meaning of the
  text.
license: CC-BY-3.0
---

# Google Markdown style guide

Apply [Google's Markdown style
guide](https://google.github.io/styleguide/docguide/style.html) to Markdown
files kept in a repository: README files, documentation, guides, and skill
files. It does not govern chat replies, commit messages, or Markdown-like
text inside code comments.

The guide wants source text that reads well and moves between tools, a
document set that stays maintainable across teams and years, and syntax that
is easy to remember. It was written for Google's hosting, Gitiles and an
internal code search; neither is a prerequisite. Use a Gitiles feature such
as `[TOC]` only where the target renderer supports it.

Explicit user instructions, the target renderer and any tool that reads the
file (required YAML front matter, generated sections, link forms a site
generator needs), the project's Markdown formatter or linter configuration,
and the established conventions of the document set take precedence. Do not
reflow or reformat whole files merely to apply the guide. Keep style-only
cleanup separate from content changes, and explain material deviations.

## Documentation approach

-   Prefer a small set of fresh, accurate documents to a sprawl of stale
    ones. Work out which docs readers need, and delete outdated material
    often, in small batches.
-   Better is better than best: improve docs in small steps rather than
    holding out for perfection. As a reviewer, approve reasonable changes
    quickly, propose concrete alternatives instead of vague comments, make
    large improvements in a follow-up change of your own, and block only a
    change that makes the docs worse. As an author, concede trivial points
    and move on.

## Names and document layout

-   Keep the original capitalization of product, tool, and binary names.
-   Open with one level-one heading that matches, or nearly matches, the
    file name; renderers use the first H1 as the page title.
-   Follow it with a short introduction of one to three sentences that tells
    a newcomer what the topic is and why it matters.
-   Use H2 and deeper for every other heading. End with a `## See also`
    section when there are further links worth collecting.
-   An author line under the title is optional; revision history usually
    serves the same purpose.
-   Where the renderer supports a `[TOC]` directive, use it unless the whole
    page fits on a laptop screen without scrolling. Place it between the
    introduction and the first H2: wherever it is displayed, its
    position in the source decides when screen readers and keyboard users
    reach it.

Application note: YAML front matter that a tool requires, as in skill files,
comes before the H1 and is not a heading; keep it intact.

## Line length and whitespace

-   Wrap Markdown at 80 characters. Links, tables, headings, and code blocks
    are exempt. A line holding a long link may run past the limit together
    with adjacent punctuation, but the surrounding text still wraps.
-   Leave no trailing whitespace, including the two-space hard line break.
    When a hard break is truly needed, end the line with a backslash, and do
    so sparingly; usually a blank line that starts a new paragraph is better.

## Headings

-   Use ATX headings (`#`, `##`), not `=` or `-` underlines.
-   Give every heading, including subsections, a unique and fully descriptive
    name, because anchors are built from heading text. For example, write
    `### Deploy checklist` and `### Rollback checklist`, not two
    `### Checklist` headings.
-   Put a space after the `#` marks and a blank line before and after each
    heading.
-   Use a single H1, as the document title.
-   Capitalize titles and headings as the capitalization page of the Google
    developer documentation style guide directs; the guide's own headings use
    sentence case.

## Lists

-   For long lists that may change, especially nested ones, use lazy
    numbering: `1.` on every item. Number short, stable lists in full, which
    reads better in source.
-   Indent nested lists by 4 spaces. Follow a number with 2 spaces and a
    bullet with 3, so item text is indented 4 spaces; indent wrapped text by
    4 spaces, or by 8 inside a nested item.
-   Short, unnested lists of single-line items may use one space after the
    marker.
-   The guide prescribes no bullet character; its examples use `*`. Keep the
    marker that the file or the formatter already uses.

This original example shows the spacing:

```markdown
1.  Install the tools.
2.  Run the setup script. Wrapped text lines up with
    the first word of the item.
    -   A nested bullet sits at the item's text indent, and
        its wrapped text is indented 8 spaces in all.
```

## Code

-   Use backticks for short code, commands, field names, and file types
    mentioned generically, such as `README.md` files in general.
-   Use a code span, too, to keep Markdown from processing text such as a
    placeholder path or an example URL that would otherwise become a link.
-   Use a fenced code block for code longer than one line, and declare its
    language so that neither highlighters nor later editors have to guess.
    Prefer fences to 4-space indented blocks, which cannot declare a
    language, have unclear boundaries, and are harder to find in code
    search.
-   In command-line snippets meant for copying, escape each line break with a
    single trailing backslash.
-   Inside a list, indent a code block to the list's text indentation so
    that it does not break the list.

## Links

-   Keep links short where possible; long links make the source hard to
    read and break line wrapping.
-   For links between Markdown pages on the same site, use an explicit path
    such as `/docs/setup.md` rather than a fully qualified URL.
-   Relative links are fine within one directory; avoid relative paths that
    climb with `../`.
-   Write link text that says where the link leads, never "here", "link", or
    a repeated URL. Write the sentence first, then link its most fitting
    phrase.
-   Use reference-style links when an inline URL would disrupt the text,
    inside tables to keep cells short, and to avoid repeating a destination
    used several times. Inline short links instead, since reference links
    hide the destination and add syntax.
-   Define each reference link at the end of the section where it is first
    used, just before the next heading, like a footnote on the current page.
    Put definitions used in several sections at the end of the document. If
    an editor or formatter insists on another placement, let the tool win.

Application note: whether a root path such as `/docs/setup.md` resolves
depends on the renderer. Some renderers and tools, skill loaders among them,
resolve links only relative to the file, so check what the target supports
before converting links. A link down into a subdirectory, such as a skill's
`references/` files, does not climb with `../`.

## Images and tables

-   Keep images rare, favoring plain screenshots, and add one only when
    showing is easier than describing, such as how to navigate a UI.
-   Give every image alt text that conveys its content to readers who cannot
    see it.
-   Use a table for tabular data that readers scan quickly: data spread
    fairly evenly across two dimensions, or a run of comparable items that
    each have their own attributes. Use a list when the data fits one easily.
-   Treat these as signs that a table is the wrong form: columns that barely
    vary or cells left empty, few rows relative to columns (or the reverse),
    and cells full of prose.
-   Keep cells short; reference links help.

## HTML

-   Strongly prefer standard Markdown and avoid HTML workarounds. When
    Markdown seems unable to express something, ask whether it is needed;
    large tables are the main case where Markdown falls short.
-   HTML makes the source less readable and less portable, which limits the
    tools that can display it, and some renderers, Gitiles among them, do
    not render it at all.

## Documentation practices

These points come from the guide's companion pages on best practices, README
files, and philosophy (linked under the source attribution below).

-   Update docs in the same change as the code they describe; reviewers may
    ask for current README files, docstrings, and other docs alongside code.
-   Delete dead docs. Clean up a neglected set gradually: remove what is
    certainly wrong first, leave the unclear for later, and lean toward
    deleting, since version history can recover what is still needed.
-   Link to an existing guide for a common technology or process instead of
    writing a duplicate; fix the original if it is missing or stale.
-   Name README files exactly `README.md`, which is case-sensitive. Put one
    in the top-level directory of each package's code, not in a docs
    directory, and keep it current, especially for packages that offer
    interfaces to other teams.
-   A package README should at least link to user- or team-facing docs, and
    include or point to: what the package is and what it is for, points of
    contact, its status (deprecated, say, or not yet generally released),
    how to use it (sample code, copyable commands), and further docs.
-   Once code ships, design documents become archives of decisions rather
    than current docs. Link from the project's README to any docs kept
    elsewhere, such as a wiki.
-   Keep the essential information readable in the raw source, without a
    renderer: content and presentation should stay separate.

## Check the change

-   Run the project's configured Markdown formatter or linter, if any, and
    keep its output; do not add tooling solely for this skill.
-   Check that every changed link and anchor resolves, and that renamed
    headings have not broken anchors that other documents link to.
-   Preview the document in the target renderer when lists, tables, code
    blocks, or front matter change; formatting checks do not prove that it
    renders as intended.
-   For a review-only request, report findings (location, rule, minimal fix)
    without editing files.

## Source and attribution

Adapted and condensed from Google's [Markdown style
guide](https://google.github.io/styleguide/docguide/style.html) and its
companion pages on
[best practices](https://github.com/google/styleguide/blob/gh-pages/docguide/best_practices.md),
[README files](https://github.com/google/styleguide/blob/gh-pages/docguide/READMEs.md),
and [philosophy](https://github.com/google/styleguide/blob/gh-pages/docguide/philosophy.md),
checked on 2026-11-03 at commit `ab89e73` of the `gh-pages` branch of
[google/styleguide](https://github.com/google/styleguide). This skill
condenses and reorganizes the guide and adds application guidance; it is not
an official Google publication, and its examples are original. Google's
guides are licensed under
[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), and code samples
in that repository under the
[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
