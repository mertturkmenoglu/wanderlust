export function buildTemplate(
	template: string,
	variables: Record<string, string>,
) {
	let result = template;

	for (const [key, value] of Object.entries(variables)) {
		result = result.replaceAll(`{{${key}}}`, value);
	}

	return result;
}
