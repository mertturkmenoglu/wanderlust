import path from 'node:path';
import { ORPCError } from '@orpc/client';
import { fileTypeFromBlob } from 'file-type';
import type { TStorageService } from '@/lib/storage';
import type * as dto from './dto';
import type { UsersRepository } from './repository';

export class UsersService {
	constructor(
		private readonly repo: UsersRepository,
		private readonly storage: TStorageService,
	) {}

	async updateImage(
		userId: string,
		data: dto.UpdateImageInput,
	): Promise<dto.UpdateImageOutput> {
		const res = await fileTypeFromBlob(data.file);

		if (!res) {
			throw new ORPCError('BAD_REQUEST', {
				message: 'Unable to determine file type',
			});
		}

		const filepath = path.join(
			data.type === 'profile' ? 'profile-images' : 'banner-images',
			`${userId}.${res.ext}`,
		);

		try {
			await this.storage.put(
				filepath,
				Buffer.from(await data.file.arrayBuffer()),
				{
					contentType: res.mime,
				},
			);

			const url = await this.storage.getUrl(filepath);
			const result = await this.repo.updateImage(userId, data.type, url);

			return {
				profile: result.profile,
			};
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to upload image',
			});
		}
	}

	async get(userId: string, data: dto.GetInput): Promise<dto.GetOutput> {
		const result = await this.repo.get(userId, data);

		return {
			profile: result.profile,
			meta: result.meta,
		};
	}

	async getMe(userId: string): Promise<dto.GetMeOutput> {
		const result = await this.repo.getMe(userId);

		return {
			profile: result.profile,
		};
	}

	async listFollowers(
		userId: string,
		data: dto.ListFollowersInput,
	): Promise<dto.ListFollowersOutput> {
		const result = await this.repo.listFollowers(userId, data);

		return {
			followers: result.followers,
			pagination: result.pagination,
		};
	}

	async listFollowing(
		userId: string,
		data: dto.ListFollowingInput,
	): Promise<dto.ListFollowingOutput> {
		const result = await this.repo.listFollowing(userId, data);

		return {
			following: result.following,
			pagination: result.pagination,
		};
	}

	async listTopPlaces(
		userId: string,
		data: dto.ListTopPlacesInput,
	): Promise<dto.ListTopPlacesOutput> {
		const result = await this.repo.listTopPlaces(userId, data);

		return {
			places: result.topPlaces,
		};
	}

	async updateTopPlaces(
		userId: string,
		data: dto.UpdateTopPlacesInput,
	): Promise<dto.UpdateTopPlacesOutput> {
		const result = await this.repo.updateTopPlaces(userId, data);

		return result;
	}

	async listActivities(
		userId: string,
		data: dto.ListUserActivitiesInput,
	): Promise<dto.ListUserActivitiesOutput> {
		const result = await this.repo.listActivities(userId, data);

		return {
			activities: result.activities,
		};
	}

	async searchFollowing(
		userId: string,
		data: dto.SearchFollowingInput,
	): Promise<dto.SearchFollowingOutput> {
		const result = await this.repo.searchFollowing(userId, data);

		return {
			friends: result.followings,
		};
	}

	async follow(
		userId: string,
		data: dto.FollowInput,
	): Promise<dto.FollowOutput> {
		const result = await this.repo.follow(userId, data);

		return {
			isFollowing: result,
		};
	}

	async update(
		userId: string,
		data: dto.UpdateInput,
	): Promise<dto.UpdateOutput> {
		const result = await this.repo.update(userId, data);

		return {
			profile: result.profile,
		};
	}
}
