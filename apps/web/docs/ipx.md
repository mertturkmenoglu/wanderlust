# IPX

- Web project uses [ipx](https://github.com/unjs/ipx) to generate on the fly images from URLs.
- To use the image proxy, you can use the `ipx` function like this:

```ts
import { ipx } from '@/lib/ipx';

<img src={ipx('https://example.com/image.jpg', 'w_512')} alt="Image" />;
```

- The `ipx` function takes two arguments:

  - The original URL of the image.
  - Transformations to apply to the image.

- Make sure the image proxy server (wiop) is running at port `3002`.

## Transformations

- `w_512` - Resize the image to 512px width.
- `f_webp` - Convert the image to WebP format.
- See https://github.com/unjs/ipx?tab=readme-ov-file#modifiers for docs.
