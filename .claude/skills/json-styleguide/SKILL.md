---
name: json-styleguide
description: >-
  Apply Google's JSON Style Guide when designing, writing, or reviewing JSON
  API request and response payloads, the schemas and documentation examples
  that describe them, and test fixtures that mirror them, even when no style
  guide is mentioned. Covers JSON syntax, flat versus nested data, property
  names (lowerCamelCase ASCII, plural arrays, map keys, reserved words),
  value types, empty and null values, string enums, RFC 3339 dates, ISO 8601
  durations, ISO 6709 coordinates, the optional apiVersion, data, and error
  envelope with its reserved paging, link, and error properties, and
  property order. Do not impose its envelope or naming conventions on
  tool-owned files such as package.json, tsconfig.json, lockfiles, or other
  configuration whose schema a tool defines, nor on published wire formats
  that already differ. The jsoncguide page name does not refer to JSON with
  comments.
license: CC-BY-3.0
---

# Google JSON style guide

Apply the [Google JSON Style
Guide](https://google.github.io/styleguide/jsoncguide.html) (revision 0.9)
when designing or changing JSON APIs: request and response bodies of RPC or
REST services, the schemas that describe them, and examples or fixtures that
stand in for them. Base syntax comes from the specification at
[JSON.org](https://www.json.org); the guide standardizes choices that the
specification leaves open.

The guide covers API payloads, not configuration. Files whose format a tool
defines, such as `package.json`, `tsconfig.json`, lockfiles, editor
settings, or linter configuration, follow that tool's schema: do not rename
their keys, wrap them in an envelope, or strip comments the tool accepts.
Despite the `jsoncguide` page name, the guide is not about JSONC (JSON with
comments).

Explicit user instructions, an API's published contract (OpenAPI or JSON
Schema documents, generated clients, existing consumers), the project's
serializer settings (such as a configured naming strategy), and established
local conventions take precedence. Do not rename fields, change null
semantics, or restructure responses of a published API merely to apply the
guide; the guide itself handles naming changes with a new name or a major
version. Keep style-only cleanup separate from behavior changes, and explain
material deviations.

## Syntax and structure

-   Do not put comments in JSON. The guide's own examples carry comments only
    to explain them.
-   Wrap every property name and every string value in double quotes. Do not
    quote booleans, numbers, or `null`.
-   Use only the value types JSON defines: objects, arrays, strings,
    numbers, booleans, and `null`. A JavaScript expression, identifier, or
    function is never a value. Pick the type that fits the data, such as a
    number for a numeric quantity.
-   Keep data flat; do not group properties into sub-objects for
    convenience. Nest only when the properties together form one meaningful
    structure, such as a postal address, and only after careful thought.

## Property names

-   Give every property a meaningful name with defined semantics.
-   Names must use lowerCamelCase and ASCII only: start with a letter, `_`,
    or `$`, and continue with letters, digits, `_`, or `$`. This mirrors
    JavaScript identifiers, so clients can use dot access.
-   Avoid JavaScript reserved words as property names. The guide's appendix
    lists them from ECMAScript 5, such as `class`, `default`, `delete`,
    `new`, and `public`, and warns that the list may vary by environment.
-   Keys of an object used as a map are exempt and may use any Unicode
    characters; clients read them with bracket notation. Document which
    objects are maps.
-   Use plural names for arrays and singular names for everything else.
    Counts are the usual exception: `totalItems` reads as a total of items,
    and `itemCount` is a singular alternative.
-   Do not use a reserved property name (listed below) for anything except
    its defined meaning.
-   JSON has no namespaces. Resolve a name conflict, including one with a
    newly reserved name, by choosing another name or by renaming only at a
    major version boundary.

## Property values

-   Consider omitting a property that is optional, empty, or `null`, unless
    its presence carries meaning. A value such as `0` that means something
    stays.
-   Represent enum values as strings, so clients cope gracefully when values
    are added, removed, or changed.

The guide defines standard string formats for three kinds of value:

| Data | Format | Example |
| --- | --- | --- |
| Date and time | RFC 3339 | `"2026-11-03T09:15:00.000Z"` |
| Time duration | ISO 8601 duration | `"PT1H30M"` |
| Latitude and longitude | ISO 6709, preferably `±DD.DDDD±DDD.DDDD` | `"+48.8584+002.2945"` |

Application note: when clients distinguish an absent property from an
explicit `null` (in a partial update, for example), keep that distinction
rather than dropping nulls.

## Envelope and reserved properties

The guide recommends one object structure for requests and responses alike.
Every reserved property is optional and appears at most once, but a service
that needs one of these concepts should use the reserved name.

-   Top level: `apiVersion`, `context`, `id`, `method`, `params`, and then
    either `data` or `error`. `apiVersion` should always be present; it
    versions the API, not the data, which etags or similar mechanisms cover.
-   A response holds `data` or `error`, not both; if both appear, `error`
    takes precedence.
-   `data` may hold `kind`, `fields`, `etag`, `id`, `lang`, `updated`,
    `deleted`, `items`, paging properties, and link properties, alongside
    the service's own properties.
-   `error` holds `code` (usually the HTTP status), `message`, and an
    `errors` array whose entries may carry `domain`, `reason`, `message`,
    `location`, `locationType`, `extendedHelp`, and `sendReport`.
-   Links pair an object form (`self`, `edit`, `next`, `previous`) with a URI
    string whose name ends in `Link` (`selfLink`, and so on).
-   `startIndex` and `pageIndex` should be 1-based. If `deleted` is present,
    it must be `true`.

Read [reserved properties](references/reserved-properties.md) when designing
or reviewing an envelope, paging, links, or error payloads, or when you need
the type and meaning of a particular reserved name.

Application note: the envelope is a recommendation for APIs that adopt it.
An API that already returns bare resources or follows another published
convention keeps its shape; apply the naming and value rules within it.

This original example shows the envelope with `kind` and `items` placed as
the next section requires:

```json
{
  "apiVersion": "1.2",
  "data": {
    "kind": "invoice",
    "updated": "2026-11-03T09:15:00.000Z",
    "startIndex": 1,
    "itemsPerPage": 2,
    "totalItems": 7,
    "nextLink": "https://api.example.com/invoices?startIndex=3",
    "items": [
      {"kind": "invoiceLine", "sku": "A-100", "quantity": 3},
      {"kind": "invoiceLine", "sku": "B-220", "quantity": 1}
    ]
  }
}
```

## Property order

-   Properties may appear in any order, but order can help streaming
    parsers, such as pull parsers on memory-constrained devices.
-   Put `kind` first in any object that has one, so a parser can choose the
    object type before reading the rest.
-   Put `items` last in `data`, so collection-level properties can be read
    without parsing every item.
-   When applying this, confirm that the serializer preserves declaration
    order before relying on it.

## Check the change

-   Parse every changed payload, fixture, and example with a strict JSON
    parser; it rejects comments, trailing commas, single quotes, and
    unquoted names.
-   Validate against the API's schema (JSON Schema or OpenAPI) and run
    contract and client tests when the shape changes. The guide states its
    structure in Orderly, which compiles to JSON Schema; use whatever schema
    language the project already has.
-   Formatting proves only syntax. Review renamed, retyped, or removed
    properties for their impact on existing consumers.
-   For a review-only request, report findings (location, rule, minimal fix)
    without editing files.

## Source and attribution

Adapted and condensed from the [Google JSON Style
Guide](https://google.github.io/styleguide/jsoncguide.html), checked on
2026-11-03 at commit `ab89e73` of the `gh-pages` branch of
[google/styleguide](https://github.com/google/styleguide). This skill
condenses and reorganizes the guide and adds application guidance; it is not
an official Google publication, and its examples are original. Google's
guides are licensed under
[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), and code samples
in that repository under the
[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
