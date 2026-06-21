# Storage

- We are using Flydrive for file uploads.
- We are highly recommending reading the [Flydrive documentation](https://fly.io/docs/introduction).
- You can find the library code in `packages/storage` directory.
- The primary driver is the File System driver but you should still think in terms of buckets.
- To define a new bucket, update the `buckets` array in `packages/storage/src/buckets.ts` file.
- `packages/storage/src/helpers.ts` file contains generic file upload utilities.
- Example usage:

```typescript
const filename = crypto.randomUUID() + ".png";
const content = await file.arrayBuffer();
const path = createPathname("bucket-foo", filename);
await storage.client.put(path, Buffer.from(content));
const url = await storage.client.getUrl(path);
console.log(url);
await storage.client.delete(path);
```
