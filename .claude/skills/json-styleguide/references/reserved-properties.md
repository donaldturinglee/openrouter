# Reserved JSON property names

Condensed from the reserved-name sections of the [Google JSON Style
Guide](https://google.github.io/styleguide/jsoncguide.html), checked on
2026-11-03. It supplements `SKILL.md`. Every property here is optional and
appears at most once in its parent; when a service needs the concept, use
the name with the meaning given. Types use the guide's terms: `number` is
JavaScript's floating-point number, `integer` a whole number.

Contents:

-   [Top-level properties](#top-level-properties)
-   [Data properties](#data-properties)
-   [Paging properties](#paging-properties)
-   [Link properties](#link-properties)
-   [Error properties](#error-properties)
-   [Inconsistencies in the source](#inconsistencies-in-the-source)

## Top-level properties

| Property | Type | Meaning |
| --- | --- | --- |
| `apiVersion` | string | API version requested, or served in a response. The guide says it should always be present. It does not version the data; use etags or a similar mechanism for that. |
| `context` | string | Chosen by the client and echoed by the server, so responses can be matched to requests, as in batch or JSON-P use. It sits at the top level so that success and error responses both carry it. |
| `id` | string | Assigned by the server to the response, success or error, so client results can be matched to server logs. Unlike `context`, the client does not choose it. |
| `method` | string | The operation to perform (request) or that was performed (response), as in JSON-RPC, where it names the operation applied to `params`. |
| `params` | object | Map of input parameters for an RPC call, used with `method`; omit it when the call takes none. |
| `data` | object | Container for the response's data: the reserved properties below plus any of the service's own. |
| `error` | object | Details of one or more errors. |

A response has `data` or `error`, not both. If both are present, `error`
takes precedence.

## Data properties

| Property | Type | Meaning |
| --- | --- | --- |
| `kind` | string | What type of object this is. It may appear in `data`, in each of the `items`, or in any object where types need telling apart. Put it first in its object. |
| `fields` | string | The fields present in a partial GET response or a partial PATCH request. Include it only for partial requests and responses, and never leave it empty. |
| `etag` | string | The etag for the response. |
| `id` | string | Globally unique identifier for the object; the service decides the details. |
| `lang` | string, BCP 47 | Language of the object's other properties, like HTML `lang` and XML `xml:lang`. Allowed in `data` or any child. A service that mixes languages in one object decides, and documents, where `lang` goes. |
| `updated` | string, RFC 3339 | When the item was last updated, as the service defines it. |
| `deleted` | boolean | Marks the containing entry as deleted. Allowed in `data` or any child. If present, it must be `true`; `false` confuses clients. |
| `items` | array | The standard place for the result's collection, so generic code, such as a pager, knows where to look. Put it last in `data`. |

## Paging properties

These live in `data`. Some terms come from the OpenSearch specification.
They support three paging styles:

-   Previous and next: step one page at a time with `nextLink` and
    `previousLink`.
-   Index-based: jump straight to an item position, for example with a
    `startIndex` query parameter.
-   Page-based: jump straight to a page number using `pageIndex` and
    `totalPages`, without working out item indexes.

| Property | Type | Meaning |
| --- | --- | --- |
| `currentItemCount` | integer | How many items this result holds; a convenience equal to the length of `items`. |
| `itemsPerPage` | integer | The page size. The last page may hold fewer items, but `items` never holds more. |
| `startIndex` | integer | Index of the first item in `items`, counting from 1. |
| `totalItems` | integer | Size of the whole set, not just this page. |
| `pagingLinkTemplate` | string | URI template for computing further paging links, with reserved variables `{index}` for the item number and `{pageIndex}` for the page number. |
| `pageIndex` | integer | Index of the current page, counting from 1. |
| `totalPages` | integer | How many pages the whole result spans. |

The guide derives `pageIndex` as `floor(startIndex / itemsPerPage) + 1` and
`totalPages` as `ceiling(totalItems / itemsPerPage)`. Application note: with
a 1-based `startIndex`, the first formula holds only for page-aligned start
indexes and page sizes above one; `floor((startIndex - 1) / itemsPerPage) + 1`
holds in every case.

## Link properties

These live in `data`. Each link comes in two forms: an object, which may hold
any kind of reference (a JSON-RPC object, for example), and a URI string
whose name always ends in `Link`.

| Properties | Meaning |
| --- | --- |
| `self` / `selfLink` | Retrieves this item's data, for example one album in a list of albums. |
| `edit` / `editLink` | Where to send update or delete requests, as in REST APIs. Include it only when the user may update or delete the item. |
| `next` / `nextLink` | Loads the next set of data; works with `itemsPerPage`, `startIndex`, and `totalItems` for paging. |
| `previous` / `previousLink` | Loads the previous set of data, in the same way. |

## Error properties

| Property | Type | Meaning |
| --- | --- | --- |
| `error.code` | integer | Error code, usually the HTTP response status. With several errors, the code of the first. |
| `error.message` | string | Human-readable message. With several errors, the message of the first. |
| `error.errors` | array | Further detail, one entry per error. |
| `errors[].domain` | string | Unique identifier of the service raising the error, which separates service-specific errors from general protocol errors. |
| `errors[].reason` | string | Unique identifier of this error; unlike `error.code`, not an HTTP status. |
| `errors[].message` | string | Human-readable message; with a single error, it matches `error.message`. |
| `errors[].location` | string | Where the error occurred, read according to `locationType`. |
| `errors[].locationType` | string | How to interpret `location`. |
| `errors[].extendedHelp` | string | URI of help text that explains the error further. |
| `errors[].sendReport` | string | URI of a report form for gathering data about the error, preloaded with parameters that describe the request. |

## Inconsistencies in the source

-   The paging template is `pagingLinkTemplate` in its section heading and
    the paging example, but `pageLinkTemplate` in the structure schema and
    the example walkthrough. Choose one spelling per API and document it;
    an existing API keeps the spelling it already uses.
-   One example spells `extendedHelp` as `extendedHelper`; the schema and
    the section heading both use `extendedHelp`.
-   The worked paging walkthrough, and one remark under `startIndex`, do not
    agree with 1-based indexing; rely on the property definitions above.

This reference is a condensed adaptation of Google's guide, licensed under
[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/); see the
attribution in `SKILL.md`.
