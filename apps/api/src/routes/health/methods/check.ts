import { injectable } from 'inversify';
import { os } from '../internal/router';

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
