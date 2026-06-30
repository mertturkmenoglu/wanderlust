import { toast } from 'sonner';

export async function copyToClipboard(text: string) {
	await navigator.clipboard.writeText(text);
	toast.success('Copied to clipboard!');
}
