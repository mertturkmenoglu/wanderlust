import { injectable } from 'inversify';
import { os } from '../shared/router';

@injectable()
export class CheckHealthMethod {
	route() {
		return os.check.handler(async () => {
			return {
				message: 'OK',
			};
		});
	}
}
