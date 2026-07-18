import { defineGenerator } from '@/lib/define-generator';
import { Fake } from '@/lib/fake';

// Name doesn't make that much sense but for the sake of naming consistency, we will keep it as is for now.
export const cleanupGenerator = defineGenerator({
	generate: async () => {
		for (const filePath of Object.values(Fake.File.paths)) {
			await Bun.file(filePath).delete();
		}
	},
});
