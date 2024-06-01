import { InferResponseType } from 'hono/client';
import { api } from './api';

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

const locationFnRef = api.locations[':id'].$get;

export type Location = InferResponseType<typeof locationFnRef>['data'];

export type Media = ArrayElement<Location['media']>;

export type Bookmarks = InferResponseType<typeof api.bookmarks.$get>['data'];

export type Bookmark = ArrayElement<Bookmarks>;

const reviewsFnRef = api.reviews.location[':id'].$get;

export type Reviews = InferResponseType<typeof reviewsFnRef>['data'];

export type Review = ArrayElement<Reviews>;
