# Storage

- We are using SeaweedFS and Flydrive for file uploads.
- SeaweedFS is an S3 compatible distributed storage system.
- Flydrive is a unified storage API library to interact with various types of storage systems.
- We highly recommend reading the [SeaweedFS documentation](https://github.com/seaweedfs/seaweedfs) and the [Flydrive documentation](https://fly.io/docs/introduction)
- You can find the library code in `packages/storage` directory.
- The primary driver is the S3 driver.
- To define a new bucket, update the `buckets` array in `packages/storage/src/buckets.ts` file.
- `packages/storage/src/helpers.ts` file contains generic file upload utilities.
- Example usage:

```typescript
const filename = crypto.randomUUID() + ".png";
const content = await file.arrayBuffer();
const filetype = await fileTypeFromBlob(file);

await storage.use('foo-bucket').put(filename, Buffer.from(content), {
	contentType: filetype.mime,
});

const url = await storage.use('foo-bucket').getUrl(filename);
console.log(url);

await storage.use('foo-bucket').delete(filename);
```
