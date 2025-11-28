export function userImage(s: string | null): string {
  if (globalThis.window !== undefined) {
    if (s === null) {
      return globalThis.window.location.origin + '/profile.png';
    }

    if (s.startsWith('//')) {
      return globalThis.window.location.protocol + s;
    }

    return s;
  }

  if (s === null) {
    return '/profile.png';
  }

  if (s.startsWith('//')) {
    // TODO: change protocol according to dev later
    return 'https:' + s;
  }

  return s;
}
