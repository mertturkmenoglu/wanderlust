import { inject, injectable } from "inversify";
import { MediaRepository } from "./repository";

@injectable()
export class MediaService {
	constructor(@inject(MediaRepository) private readonly mediaRepository: MediaRepository) { }
}
