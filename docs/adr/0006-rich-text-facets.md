# ADR-0006: Rich Text Facets

## Status
Accepted

## Context
We want to support rich text features in our application. Currently, there are three areas where we need rich text support:

- Collection descriptions
- Reviews
- Chat messages

We have considered several options for implementing rich text support:

- `Tiptap` ([Docs](https://tiptap.dev/docs/editor/getting-started/overview))
- `Quill` ([Docs](https://quilljs.com/docs/quickstart))
- `Slate` ([Docs](https://docs.slatejs.org/))
- `Lexical` ([Docs](https://lexical.dev/docs/intro))

We decided to go with Tiptap but with additional libraries to support the features we need.

Tiptap provides a flexible and extensible base for building any type of RTEs (Rich Text Editor).

Our application needs two types of rich text support:
1. RTE with mention, hashtag, and link support: This is the RTE we want to expose to our end users. It should be limited in capability to only allow a specific set of features.
2. RTE with full feature support: This is the RTE we want to use internally for our admin users. It should allow almost all basic text formatting features.

### Definitions

`Facet`: We borrowed this term from Bluesky. A Rich Text Facet is a piece of metadata that describes the segments of a text which have special meaning. For example, a mention of a user, a hashtag, or a link can be considered as facets.

Our review RTE implementation and facet extraction is heavily inspired by Bluesky's implementation. We recommend reading these documents:

- https://atproto.com/guides/lexicon-style-guide#design-patterns
- https://www.pfrazee.com/blog/why-facets

### Reviews RTE
What we need for reviews feature rich text editor:
- Mention support: Users should be able to mention other users in their reviews. Tiptap provides a mention extension that allows us to implement this feature easily.
- Hashtag support: Users should be able to add hashtags in their reviews. Tiptap's Mention extension can be used but we went with a custom extension to support hashtags as well.
- Link support: Users should be able to add links in their reviews. We extended Tiptap's Link extension to support this feature.

After UI implementation, we had to decide to how to store the data in the database. Instead of storing the data in the format Tiptap provides, we decided to extract the `facets` from the review content and store it in a different format.
We used `linkify` ([Docs](https://linkify.js.org/docs/)) to extract the facets from the review content.

Because Linkify's behavior is quirky, we added a support package in the monorepo: `packages/richtext`. This package can be extended in the future to support more rich text features.

Currently, it provides a function to create custom linkify instance with custom rules and a function to extract facets from the review content.

Our review rich text features rely on 3 different technology:
- When user writes a review, we use Tiptap to provide the rich text editor with mention, hashtag, and link support.
- When user submits the review, we send the plain text content to the backend. The backend uses `linkify` to extract the facets from the review content and store them in the database.
- When we display the review content, we use a custom React component (`EnrichedText`) to render the content with facets.

### Future RTE support
Our chat rich text features will probably be similar to the reviews rich text features but we may enable additional text formatting features like bold, italic, underline, etc.

We may also consider using `emojimart` to support emojis in our rich text features.

Our admin RTE will utilize more of Tiptap's features.

## Decision
We started using:
- Tiptap (Commit: `f708aec816d93fd390d8a2ed8790b82eee8507f3`)
- Linkify.js (Commit: `a15face1a4bd5d40fe233fd516d036a083163ac1`)

## Consequences
- Positive:
	- We can support rich text features in our application.
	- We own the facet storage format and can change it in the future if needed.
- Negative:
	- We have to maintain different rich text implementations for different features in our application.
- Neutral / follow-ups:
	- We must ensure that the rich text features we implement are accessible and usable for all users.
	- We must ensure the RTEs we implement don't drift too far away from each other in terms of feature, behavior, storage format, and rendering.
