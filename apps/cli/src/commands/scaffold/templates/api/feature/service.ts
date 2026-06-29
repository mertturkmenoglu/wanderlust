export const template = `
import type { {{feature}} as dto } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { {{Feature}}Repository } from './repository';

@injectable()
export class {{Feature}}Service {
	constructor(
		@inject({{Feature}}Repository)
		private readonly repo: {{Feature}}Repository,
	) {}

	async get(_userId: string | null, data: dto.GetInput): Promise<dto.GetOutput> {
		const result = await this.repo.get(data);

		return result;
	}
}
`;
