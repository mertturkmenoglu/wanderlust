# Flydrive

- We are using Flydrive for file uploads.
- You can find the library code in `src/lib/storage` folder.
- The primary driver is the File System driver but you should still think in terms of buckets.
- To define a new bucket, update the `buckets` array in `src/lib/storage/buckets.ts` file.
- `helpers.ts` file contains generic file upload utilities.
- Example usage:

```typescript
const filename = crypto.randomUUID() + ".png";
const content = await file.arrayBuffer();
const path = createPathname("bucket-foo", filename);
await upload.client.put(path, Buffer.from(content));
const url = await upload.client.getUrl(path);
console.log(url);
await upload.client.delete(path);
```
