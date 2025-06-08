# Feature Flags

## Usage

- To use the feature flags, you need to provide the following environment variables:
  - `VITE_FLAGS_SERVICE_URL`: The URL of the feature flags service.
- Router Context defines a `flags` object that contains the feature flags.
- `useFeatureFlags` hook returns the feature flags as an object.

## Example

```tsx
import { useFeatureFlags } from '@/providers/flags-provider';

function MyComponent() {
  const flags = useFeatureFlags();

  return (
    <div>
      {flags['foo'] ? <div>Foo is enabled</div> : <div>Foo is disabled</div>}
    </div>
  );
}
```

or

```tsx
export const Route = createFileRoute('/foo')({
  component: () => {
    return <div>Foo</div>;
  },
  loader: ({ context: { flags } }) => {
    console.log(flags['foo']);
  },
});
```
