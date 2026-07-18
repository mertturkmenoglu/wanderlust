import { schema } from '@wanderlust/db';
import { data } from '@/fixtures/categories';
import { getDb } from '@/lib/common';
import { defineGenerator } from '@/lib/define-generator';

export const categoriesGenerator = defineGenerator({
	generate: async () => {
		const db = await getDb();

		await db.insert(schema.categories).values(data);
	},
});
