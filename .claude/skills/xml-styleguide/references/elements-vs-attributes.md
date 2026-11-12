# Choosing elements or attributes

Condensed from the elements-versus-attributes section of the [Google XML
Document Format Style
Guide](https://google.github.io/styleguide/xmlguide.html), checked on
2026-11-03. It supplements `SKILL.md`. The guide offers these as
considerations, without rationales, not as rules.

## General considerations

-   An all-element design is the simplest, since every design needs
    elements and attributes are the more restrictive of the two, but
    simplest is not the same as best.
-   Memory: tree models turn elements into nodes, sometimes into
    application-specific objects, which cost more than attribute strings,
    while streaming parsers report all of an element's attributes at once,
    which costs memory when values are long.
-   Escaping applies to both, so it should not sway the design, and neither
    should ease of processing in one language; XSLT handles both equally
    well.
-   Data that users should usually see leans toward elements, other data
    toward attributes, though designs often depart from this.
-   When extending a schema, do as it does. RELAX NG and Schematron treat
    the two symmetrically; DTDs and W3C XML Schema serve elements better.

## Favor elements when

-   Something can occur more than once, instead of numbered attributes such
    as `item1` and `item2`.
-   The data is an independent object, has a parent or child relationship
    with other data, carries strict typing or relationship rules, or
    depends on order, which attributes lack.
-   The data has, or may gain, a substructure of its own, or is a
    constituent of some larger piece of data.
-   The value spans lines, which an attribute would collapse into spaces,
    or is very large, so that it can be streamed.
-   The text is natural language, so `xml:lang` can label it. Some writing
    systems also need child markup, such as ruby annotations for Japanese
    or bidirectional handling for Hebrew and Arabic.

## Favor attributes when

-   The value is a code: an enumeration value, an entry in a code list, or
    a term from a controlled vocabulary, such as a language tag, a currency
    code, or a medical diagnostic code.
-   The data is metadata about other data, such as its class, its role, or
    how to process it.
-   The data is an identifier, in an attribute named `xml:id`, or a
    reference to one, or a hypertext reference, conventionally in `href`.
-   The value applies to descendants unless overridden, as namespace
    declarations and `xml:base`, `xml:lang`, or `xml:space` do.
-   The value is a list of whitespace-separated tokens, the exception to the
    substructure point; schema validators handle no other separator.
-   Terseness truly matters most, though `gzip` compression, which shrinks
    repetitive documents well, deserves a look first.

## Mixing the two

Mixing attributes and child elements without a pattern makes a format hard
to read and awkward to use. Using both makes sense when the data divides
clearly into two groups, such as simple and complex values, or metadata and
data.

This reference is a condensed adaptation of Google's guide, licensed under
[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/); see the
attribution in `SKILL.md`.
