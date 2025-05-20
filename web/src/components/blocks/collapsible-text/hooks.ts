export function useShortText(s: string, limit: number): string {
  return s.length < limit ? s : s.slice(0, limit) + '...';
}

export function useParagraphs(s: string, limit: number, showMore: boolean) {
  const shortText = useShortText(s, limit);
  const displayText = showMore ? s : shortText;
  const paragraphs = displayText.split('\n');
  return paragraphs;
}
