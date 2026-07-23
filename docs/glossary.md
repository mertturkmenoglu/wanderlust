# Glossary of Terms

A collection of terminology used in the context of Wanderlust and their definitions.

## oRPC

Backend framework used in Wanderlust for building APIs and services. Read [our oRPC docs](orpc.md) for more information.

## Facet

A Rich Text Facet is a piece of metadata that describes the segments of a text which have special meaning. For example, a mention of a user, a hashtag, or a link can be considered as facets. Read [ADR-0006](adr/0006.md) for more information.

## POI

Point of interest. A specific location or landmark that is of interest to travelers and users of Wanderlust. In Wanderlust, we use "place" instead of "POI". But you may still hear it in general, especially in the context of mapping and geolocation.

## RTE

Rich text editor. A user interface component that allows users to create and edit text with formatting options, such as bold, italic, lists, links, and more. In Wanderlust, we use Tiptap as our RTE.

## ADR

Architecture Decision Record. A document that captures important architectural decisions made during the development of Wanderlust, along with their context, rationale, and consequences. Read [ADR-0001](adr/0001.md) for an example.

## Accolade

An award or recognition given to a place or user based on their achievements, contributions, or popularity within the Wanderlust community.

## Data Resource

A data resource (in the context of `admin` project) is a representation of a data entity that can be managed and manipulated through the admin interface. It typically corresponds to a model or collection in the backend, allowing administrators to perform CRUD (Create, Read, Update, Delete) operations on the underlying data.

## IFF

IFF stands for `Identity Factory Function`. Read [ADR-0003](adr/0003.md) for more information.

## Aggregation

In the context of Wanderlust, aggregation refers to the process of combining multiple pieces of data or content into a single, unified view or representation. Backend API has an aggregation endpoint that is especially useful for fetching homepage content.
