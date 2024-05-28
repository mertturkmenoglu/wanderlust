import { InferResponseType } from "hono/client";
import { api } from "./api";

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

const locationFnRef = api.locations[":id"].$get;

export type Location = InferResponseType<typeof locationFnRef>["data"];

export type Media = ArrayElement<Location["media"]>;
