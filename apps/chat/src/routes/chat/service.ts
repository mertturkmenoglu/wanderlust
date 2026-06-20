import { inject, injectable } from "inversify";
import { ChatRepository } from "./repository";

@injectable()
export class ChatService {
	constructor(@inject(ChatRepository) private readonly repository: ChatRepository) {
		console.log('', this.repository == null ? '' : '')
	}
}
