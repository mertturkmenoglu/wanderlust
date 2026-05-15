import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

const schema = z.object({
	addressMode: z.enum(['select', 'create']),
	name: z
		.string()
		.min(1)
		.max(256)
		.meta({
			description: 'Name of the place',
			examples: ['The British Museum'],
		}),
	description: z
		.string()
		.min(1)
		.meta({
			description: 'Description of the place',
			examples: [
				'A world-famous museum showcasing art and artifacts from around the globe.',
			],
		}),
	phone: z
		.string()
		.max(32)
		.optional()
		.meta({
			description: 'Contact phone number of the place',
			examples: ['+90 500 123 4567'],
		}),
	website: z
		.url()
		.optional()
		.meta({
			description: 'Website URL of the place',
			examples: ['https://www.example.com'],
		}),
	addressId: z
		.number()
		.int()
		.min(0)
		.max(2147483647)
		.meta({
			description: 'ID of the address associated with the place',
			examples: [2048],
		}),
	categoryId: z
		.number()
		.int()
		.min(1)
		.max(32767)
		.meta({
			description: 'ID of the category associated with the place',
			examples: [12],
		}),
	priceLevel: z
		.number()
		.int()
		.min(1)
		.max(5)
		.meta({
			description: 'Price level of the place (1-5)',
			examples: [1, 2, 3, 4, 5],
		}),
	accessibilityLevel: z
		.number()
		.int()
		.min(1)
		.max(5)
		.meta({
			description: 'Accessibility level of the place (1-5)',
			examples: [1, 2, 3, 4, 5],
		}),
	hours: z.record(z.string(), z.string()).meta({
		description: 'Operating hours of the place',
		examples: [
			{
				mon: '9:00 AM - 5:00 PM',
				tue: '9:00 AM - 5:00 PM',
				wed: '9:00 AM - 5:00 PM',
				thu: '9:00 AM - 5:00 PM',
				fri: '9:00 AM - 5:00 PM',
				sat: '10:00 AM - 6:00 PM',
				sun: 'Closed',
			},
		],
	}),
	amenities: z.array(z.string()).meta({
		description: 'List of amenities available at the place',
		examples: [['WiFi', 'Parking', 'Restrooms']],
	}),
});

export type FormInput = z.infer<typeof schema>;

export function useCreatePlaceForm() {
	return useForm({
		resolver: zodResolver(schema),
	});
}
