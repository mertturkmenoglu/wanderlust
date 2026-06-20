import { inject, injectable } from "inversify";
import { MembersRepository } from "./repository";

@injectable()
export class MembersService {
	constructor(@inject(MembersRepository) private readonly membersRepository: MembersRepository) {
		console.log('', this.membersRepository == null ? '' : '')
	}
}
