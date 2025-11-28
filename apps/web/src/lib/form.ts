import type { MultipleFieldErrors } from 'react-hook-form';

function lengthTracker(s: string | undefined, max: number): string {
  return `${s?.length ?? 0}/${max}`;
}

function truncateWithEllipses(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + '...' : s;
}

function normalizeMultipleErrors(
  errors: MultipleFieldErrors | undefined,
): Array<{ message: string }> {
  if (!errors) {
    return [];
  }

  return Object.values(errors).flatMap((err) => {
    if (typeof err === 'string') {
      return [{ message: err }];
    } else if (Array.isArray(err)) {
      return err.map((message) => ({ message }));
    } else {
      return [];
    }
  });
}

export { lengthTracker, truncateWithEllipses, normalizeMultipleErrors };
