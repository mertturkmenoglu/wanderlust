import { inject, injectable } from "inversify";
import { MessagesRepository } from "./repository";

@injectable()
export class MessagesService {
	constructor(@inject(MessagesRepository) private readonly messagesRepository: MessagesRepository) { }
}
