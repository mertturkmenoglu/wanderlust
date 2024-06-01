import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

export const schemas: CollectionCreateSchema[] = [
  {
    name: 'locations',
    enable_nested_fields: true,
    fields: [
      { name: 'id', type: 'string', facet: true },
      { name: 'name', type: 'string', facet: true, index: true },
      { name: 'address', type: 'object', index: true },
      { name: 'website', type: 'string', optional: true },
      { name: 'phone', type: 'string', optional: true },
      { name: 'priceLevel', type: 'int32', facet: true },
      { name: 'accessibilityLevel', type: 'int32', facet: true },
      { name: 'description', type: 'string', index: true },
      { name: 'media', type: 'object[]' },
      { name: 'tags', type: 'string[]', facet: true },
      { name: 'categoryId', type: 'int32', facet: true },
      { name: 'createdAt', type: 'auto' },
      { name: 'updatedAt', type: 'auto' },
    ],
  },
];
