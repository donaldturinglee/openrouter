---
name: sql-styleguide
description: >-
  Apply Simon Holywell's SQL style guide (sqlstyle.guide) when writing,
  editing, formatting, or reviewing SQL: queries, views, schema definitions
  and constraints, migrations, stored procedures, and SQL embedded in
  application code, ORM mappings, or mapper files, even when no style guide is
  mentioned. Covers naming, uppercase keywords, river alignment, joins and
  subqueries, preferred constructs, data types, defaults, keys, and
  constraints, while preserving the target dialect, bind parameters, and
  existing schema contracts.
license: CC-BY-SA-4.0
---

# Simon Holywell's SQL style guide

Apply the [SQL style guide](https://www.sqlstyle.guide/) by Simon Holywell to
the SQL being written or changed. Its premise is that a team should pick one
style and keep to it. It aims to stay compatible with Joe Celko's *SQL
Programming Style*, favors portable standard SQL, and is deliberately brief.

Explicit user instructions, the project's configured SQL formatter or linter,
the target engine's syntax, and established schema conventions take
precedence. Do not rename existing tables, columns, or constraints, rewrite
applied migrations, or reformat whole files merely to apply the guide: use its
naming rules for new objects and its layout rules for the statements you
touch. Keep style-only edits separate from behavior changes, and explain
material deviations.

## Applying the guide safely

-   Identify the engine and version (PostgreSQL, MySQL, SQLite, SQL Server,
    Oracle, and so on) before choosing syntax. The guide prefers ANSI forms,
    but a dialect feature the code actually needs stays.
-   In SQL embedded in another language (string literals, ORM annotations,
    mapper XML, migration changelogs), preserve bind parameters and
    placeholders, host-language escaping, dynamic-SQL tags, statement
    delimiters, and tool directives. Format only the SQL itself.
-   Before reformatting, confirm that the rewrite keeps its meaning: `AND` and
    `OR` precedence, `NULL` handling (especially `NOT IN` over a nullable
    list), inclusive `BETWEEN` versus half-open ranges, `UNION` versus
    `UNION ALL`, and result-column names that callers map.

## General conventions

-   Use consistent, descriptive names and enough whitespace and indentation
    to make statements easy to scan.
-   Keep date and time values ISO 8601 compliant
    (`YYYY-MM-DDTHH:MM:SS.SSSSS`).
-   Prefer standard SQL functions to vendor-specific ones for portability.
-   Leave out redundant SQL: unneeded quoting or parentheses, and `WHERE`
    conditions that are already implied.
-   Comment where it helps. Prefer `/* ... */`; otherwise start the comment
    with `--` and end it at the line break.
-   Avoid camelCase, which is hard to scan, and quoted identifiers. If
    quoting is unavoidable, use SQL-92 double quotes, which some servers must
    be configured to accept.
-   Do not carry object-oriented design principles into SQL or schemas.

## Naming

-   Make each name unique and keep it off the reserved keyword list. Check the
    target engine's own list; the guide's appendix covers old engine versions.
-   Keep names to 30 bytes at most, which is 30 characters unless a multibyte
    character set is in use.
-   Start with a letter and use only letters, digits, and underscores. Never
    end with an underscore or use consecutive underscores.
-   Put an underscore where a space would naturally go (`unit_price`). Avoid
    abbreviations; keep only widely understood ones.
-   Tables take a collective noun where one exists (`fleet` rather than
    `vehicles`) and otherwise a plural. Never prefix them with `tbl` or
    similar. A table and one of its columns never share a name.
-   Name a relationship table for the concept it records rather than gluing
    two table names together (`enrollments`, not `students_courses`).
-   Columns are singular and lowercase, except where case carries meaning, as
    with a proper noun. Where possible, avoid a bare `id` as the primary
    identifier.
-   Correlation names (aliases) relate to the object or expression they
    stand for. As a rule of thumb, take the first letter of each word
    (`order_lines AS ol`), and append a number on a collision (`s1`, `s2`).
    Always write `AS`.
-   Name a computed value (`SUM(...)`, `AVG(...)`) the way you would name the
    equivalent schema column.
-   Stored procedure names contain a verb and carry no `sp_` or similar
    prefix.

Use these suffixes where their meaning fits:

| Suffix | Meaning |
| --- | --- |
| `_id` | A unique identifier, such as a primary key column |
| `_status` | A flag or any other status, such as `payment_status` |
| `_total` | The sum of a collection of values |
| `_num` | A number of any kind |
| `_name` | A name, such as `last_name` |
| `_seq` | A contiguous sequence of values |
| `_date` | The date of something |
| `_tally` | A count |
| `_size` | A size, such as a file size |
| `_addr` | A physical or intangible address, such as `email_addr` |

## Query layout

### Keywords

-   Write reserved keywords in uppercase (`SELECT`, `WHERE`).
-   Prefer the full form of a keyword to its abbreviation where both exist,
    and an ANSI keyword to a vendor keyword with the same effect. This is
    keyword guidance: do not rename built-in functions whose names merely
    look abbreviated.

### The river

-   Right-align the clause keywords so they all end in the same column. The
    gap after them forms a "river" that separates keywords from the
    expressions, which start in a common column to its right.
-   Put spaces on both sides of `=`, after commas, and around string literals,
    except where a literal sits inside parentheses or is followed by a comma
    or semicolon.
-   Start a new line before each `AND` or `OR`, after each clause, after a
    semicolon so statements stand apart, after a comma that closes a logical
    group of columns, and between related sections of a long script.

```sql
SELECT o.order_num,
       o.order_date, o.ship_date
  FROM orders AS o
 WHERE o.order_status = 'open'
   AND o.order_date >= '2026-01-01';
```

### Joins

-   Indent a qualified join (`INNER JOIN`, `LEFT JOIN`, and so on) to the
    expression side of the river and keep its `ON` directly beneath it, with
    further conditions indented more. Separate consecutive joins with a blank
    line where that helps.
-   A bare `JOIN` is the exception: it sits on the keyword side of the river,
    right-aligned like `FROM`, and its `ON` does too.

```sql
SELECT c.customer_name, ol.unit_price
  FROM customers AS c
       INNER JOIN orders AS o
       ON o.customer_id = c.customer_id
          AND o.order_status = 'paid'

       INNER JOIN order_lines AS ol
       ON ol.order_id = o.order_id;
```

```sql
SELECT c.customer_name
  FROM customers AS c
  JOIN orders AS o
    ON o.customer_id = c.customer_id;
```

### Subqueries

-   Place a subquery on the expression side of the river and lay it out by
    the same rules, so it gets its own inner river.
-   Where it helps, especially with nesting, put the closing parenthesis on
    its own line in the column of its opening partner.

```sql
SELECT c.customer_name,
       (SELECT MAX(o.order_date)
          FROM orders AS o
         WHERE o.customer_id = c.customer_id) AS last_order_date
  FROM customers AS c
 WHERE c.customer_id IN
       (SELECT o.customer_id
          FROM orders AS o
         WHERE o.order_status = 'open');
```

## Preferred constructs

-   Use `BETWEEN` instead of two comparisons joined by `AND` where it means
    the same thing, and `IN (...)` instead of repeated `OR` equality tests on
    one expression.
-   Use a `CASE` expression when the database should interpret a value before
    returning it; nest `CASE` expressions for more involved logic.
-   Avoid `UNION` and temporary tables where possible. If a schema change
    would remove the need for them, that change is probably the better fix.

## Schema definitions

-   Order and group column definitions logically, and indent them four
    spaces inside `CREATE TABLE`.
-   Avoid vendor-specific data types: they are not portable and may be
    missing from older releases of the same product. The guide's appendix
    lists portable choices such as `VARCHAR`, `INTEGER`, `DECIMAL`,
    `TIMESTAMP`, and `BOOLEAN`.
-   Use `REAL` or `FLOAT` only when floating-point arithmetic is truly
    required; otherwise use `NUMERIC` or `DECIMAL`.
-   Give a default the column's own type (a `DECIMAL` column gets a decimal
    default, not an integer), and write `DEFAULT` after the type and before
    `NOT NULL`.

### Keys

-   Every table needs at least one key.
-   Choose keys deliberately. Values should be unique to some degree, use a
    type that stays consistent across the schema and is unlikely to change,
    ideally validate against a published standard such as an ISO code, and
    stay as simple as possible; compound keys are fine where needed.
-   Treat key design as a balance to revisit if requirements change.

### Constraints

-   Name constraints yourself, except `PRIMARY KEY`, `FOREIGN KEY`, and
    `UNIQUE`, where vendor-generated names are usually clear enough.
-   Declare the primary key first, immediately inside `CREATE TABLE`.
-   Put a column's constraints directly beneath it, indented to line up to
    the right of the column name.
-   Keep a multi-column constraint close to the columns it covers, moving it
    to the end of the definition only as a last resort. Constraints on the
    whole table also go at the end.
-   Write `ON DELETE` before `ON UPDATE`.
-   Where it reads well, align recurring parts such as types or `NOT NULL` in
    one column. This aids scanning; it is not a hard rule.
-   Use `LIKE` or `SIMILAR TO` constraints for strings with a known format.
-   When a numeric range is known, enforce it with a range `CHECK` so that
    bad or oversized values cannot enter or be silently truncated. At
    minimum, most numeric columns warrant a greater-than-zero check; do not
    add one where zero or negative values are valid data.
-   Keep each `CHECK` in its own clause so failures are easier to trace.

```sql
CREATE TABLE products (
    PRIMARY KEY (product_id),
    product_id    INTEGER       NOT NULL,
    product_name  VARCHAR(200)  NOT NULL,
    unit_price    DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
                  CONSTRAINT unit_price_range
                  CHECK (unit_price BETWEEN 0.00 AND 99999.99),
    stock_tally   INTEGER       DEFAULT 0 NOT NULL,
                  CONSTRAINT stock_tally_minimum
                  CHECK (stock_tally >= 0)
);
```

### Designs to avoid

-   Translating object-oriented designs directly into tables.
-   Keeping a value in one column and its unit in another. Make the unit
    evident from the column itself and enforce valid values with `CHECK`.
-   Entity-attribute-value tables; use a product built for schema-less data
    instead.
-   Splitting one logical table into many for arbitrary reasons, such as
    time-based archives or regional offices, which forces later queries to
    `UNION` the pieces back together.

## Check the change

-   Run the project's configured SQL formatter or linter, if any, and review
    its output for altered literals, comments, bind parameters, and migration
    directives. Use a tool only if it understands the dialect and any host
    syntax around the SQL; when the project has adopted a formatter, its
    layout wins over the river style.
-   When behavior changes, run the affected queries and migration tests
    against the intended engine, for example the project's test database.
    Formatting alone does not prove a query still returns the same rows.
-   For a review-only request, report each finding with its location, the
    rule, and a minimal fix, without editing files.

## Source and attribution

Adapted and condensed from the [SQL style guide](https://www.sqlstyle.guide/)
by [Simon Holywell](https://www.simonholywell.com/), checked on 2026-11-03 at
treffynnon/sqlstyle.guide commit `70b612f`. This skill condenses and
reorganizes the guide, replaces its examples with original ones, and adds
application guidance. It is not an official publication of the guide's author.

The source is licensed under the [Creative Commons Attribution-ShareAlike 4.0
International License](https://creativecommons.org/licenses/by-sa/4.0/), and
this adapted skill is shared under the same license.
