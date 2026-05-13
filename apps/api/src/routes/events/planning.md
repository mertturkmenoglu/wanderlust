Endpoints:
- create
- get
- list
- update
- delete
- updateAmenities
- updateFaq
- updateCategories
- updateTicketOptions
- updateAgenda
- updateLineup
- createAsset
- updateAssets
- deleteAsset
- addToMyInterestedEvents
- listMyInterestedEvents
- deleteFromMyInterestedEvents
- listByPlaceId
- listByOrganizerId
- listByCategory
- listInterestedFriends

Event DTO
```typescript
type Event = {
	id: string;
	title: string;
	startsAt: Date;
	endsAt: Date;
	description: string;
	organizerId: string;
	externalUrl: string | null;
	ageRestriction: enum;
	amenities: string[];
	refundPolicy: enum;
	faq: Record<string, string>;
	placeId: string | null;
	addressId: number | null;
	isOnline: boolean;
	recurrence: enum;
	categories: string[];
	createdAt: Date;
	updatedAt: Date;
	ticketOptions: {
		id: string;
		eventId: string;
		name: string;
		description: string;
		fee: number;
		currency: string;
		totalAvailability: number;
		currentAvailability: number;
		salesStart: Date | null;
		salesEnd: Date | null;
		createdAt: Date;
		updatedAt: Date;
	}[];
	agenda: {
		id: string;
		eventId: string;
		startsAt: Date;
		endsAt: Date;
		title: string;
		description: string | null;
	}[];
	lineup: {
		id: string;
		eventId: string;
		name: string;
		userId: string | null;
		badge: string;
		title: string | null;
		description: string | null;
		order: number;
	}[];
	assets: {
		id: bigint;
		entityType: enum;
		entityId: string;
		url: string;
		description: string | null;
		order: number;
		createdAt: Date;
		updatedAt: Date;
	}[];
}
```
