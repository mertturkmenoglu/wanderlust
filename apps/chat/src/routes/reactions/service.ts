import { inject, injectable } from "inversify";
import { ReactionsRepository } from "./repository";

@injectable()
export class ReactionsService {
	constructor(@inject(ReactionsRepository) private readonly reactionsRepository: ReactionsRepository) {
		console.log('', this.reactionsRepository == null ? '' : '');
	}
}
