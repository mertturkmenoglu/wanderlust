import { schema } from '@wanderlust/db';
import { data } from '@/fixtures/cities';
import { getDb } from '@/lib/common';
import { defineGenerator } from '@/lib/define-generator';

export const citiesGenerator = defineGenerator({
	generate: async () => {
		const db = await getDb();

		await db.insert(schema.cities).values(data);
	},
});
