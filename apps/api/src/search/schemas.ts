import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

export const schemas: CollectionCreateSchema[] = [
  {
    name: "locations",
    enable_nested_fields: true,
    fields: [
      { name: "id", type: "string", facet: true },
      { name: "name", type: "string", facet: true, index: true },
      { name: "address", type: "object", index: true },
      { name: "website", type: "string", optional: true },
      { name: "phone", type: "string", optional: true },
      { name: "price_level", type: "int32", facet: true },
      { name: "accessibility_level", type: "int32", facet: true },
      { name: "tags", type: "string[]", facet: true },
      { name: "category_id", type: "int32", facet: true },
      { name: "created_at", type: "int64" },
      { name: "updated_at", type: "int64" },
    ],
  },
];
