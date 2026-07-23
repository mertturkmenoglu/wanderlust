import { Amenities } from '@wanderlust/contract';
import { injectable } from 'inversify';
import { os } from '../shared/router';

@injectable()
export class ListAmenitiesMethod {
	route() {
		return os.list.handler(async () => {
			return {
				amenities: Amenities.values,
			};
		});
	}
}
