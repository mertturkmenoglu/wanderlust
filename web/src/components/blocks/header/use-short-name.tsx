import { useMemo } from 'react';

export function useShortName(fullName: string, maxLength = 15): string {
  const shortName = useMemo(() => {
    if (fullName.length > maxLength) {
      return fullName.substring(0, maxLength) + '...';
    }
    return fullName;
  }, [fullName]);

  return shortName;
}
