import { ORPCError } from '@orpc/client';
import { Tokens } from '@wanderlust/common';
import type { Users } from '@wanderlust/contract';
import { getFilenameFromUrl, type StorageService } from '@wanderlust/storage';
import { nanoid } from '@wanderlust/uid';
import { fileTypeFromBlob } from 'file-type';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { TraceAll } from '@/lib/tracer';
import { UsersRepository } from './repository';

@injectable()
@TraceAll()
export class UsersService {
	constructor(
		@inject(UsersRepository) private readonly repo: UsersRepository,
		@inject(Tokens.Storage) private readonly storage: StorageService,
	) {}

	async updateImage(
		userId: string,
		data: Users.dto.UpdateImageInput,
	): Promise<Users.dto.UpdateImageOutput> {
		const res = await fileTypeFromBlob(data.file);

		invariant(res, 'BAD_REQUEST', 'Unable to determine file type');

		const id = nanoid();
		const filename = `${id}.${res.ext}`;
		const bucket = data.type === 'profile' ? 'profile-images' : 'banner-images';

		try {
			await this.storage
				.use(bucket)
				.put(filename, Buffer.from(await data.file.arrayBuffer()), {
					contentType: res.mime,
				});

			const url = await this.storage.use(bucket).getUrl(filename);
			const result = await this.repo.updateImage(userId, data.type, url);

			try {
				if (result.previousUrl) {
					const filename = getFilenameFromUrl(result.previousUrl);

					if (filename !== '') {
						await this.storage.use(bucket).delete(filename);
					}
				}
			} catch (err) {
				// If the deletion fails and the previous URL is not null, then log the error but do not fail the whole operation
				if (result.previousUrl !== null) {
					console.error('Failed to delete previous image from storage', err);
				}
			}

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

	async get(
		userId: string,
		data: Users.dto.GetInput,
	): Promise<Users.dto.GetOutput> {
		const result = await this.repo.get(userId, data);

		return {
			profile: result.profile,
			meta: result.meta,
		};
	}

	async getById(
		userId: string,
		data: Users.dto.GetByIdInput,
	): Promise<Users.dto.GetByIdOutput> {
		const result = await this.repo.getById(userId, data);

		return {
			profile: result.profile,
			meta: result.meta,
		};
	}

	async getMe(userId: string): Promise<Users.dto.GetMeOutput> {
		const result = await this.repo.getMe(userId);

		return {
			profile: result.profile,
		};
	}

	async getRole(userId: string): Promise<Users.dto.GetRoleOutput> {
		const result = await this.repo.getRole(userId);

		return {
			role: result.role,
		};
	}

	async listFollowers(
		userId: string,
		data: Users.dto.ListFollowersInput,
	): Promise<Users.dto.ListFollowersOutput> {
		const result = await this.repo.listFollowers(userId, data);

		return {
			followers: result.followers,
			pagination: result.pagination,
		};
	}

	async listFollowing(
		userId: string,
		data: Users.dto.ListFollowingInput,
	): Promise<Users.dto.ListFollowingOutput> {
		const result = await this.repo.listFollowing(userId, data);

		return {
			following: result.following,
			pagination: result.pagination,
		};
	}

	async listTopPlaces(
		userId: string,
		data: Users.dto.ListTopPlacesInput,
	): Promise<Users.dto.ListTopPlacesOutput> {
		const result = await this.repo.listTopPlaces(userId, data);

		return {
			places: result.topPlaces,
		};
	}

	async updateTopPlaces(
		userId: string,
		data: Users.dto.UpdateTopPlacesInput,
	): Promise<Users.dto.UpdateTopPlacesOutput> {
		const result = await this.repo.updateTopPlaces(userId, data);

		return result;
	}

	async listActivities(
		userId: string,
		data: Users.dto.ListUserActivitiesInput,
	): Promise<Users.dto.ListUserActivitiesOutput> {
		const result = await this.repo.listActivities(userId, data);

		return {
			activities: result.activities,
		};
	}

	async searchFollowing(
		userId: string,
		data: Users.dto.SearchFollowingInput,
	): Promise<Users.dto.SearchFollowingOutput> {
		const result = await this.repo.searchFollowing(userId, data);

		return {
			friends: result.followings,
		};
	}

	async follow(
		userId: string,
		data: Users.dto.FollowInput,
	): Promise<Users.dto.FollowOutput> {
		const result = await this.repo.follow(userId, data);

		return {
			isFollowing: result,
		};
	}

	async update(
		userId: string,
		data: Users.dto.UpdateInput,
	): Promise<Users.dto.UpdateOutput> {
		const result = await this.repo.update(userId, data);

		return {
			profile: result.profile,
		};
	}

	async checkUsernameAvailability(
		data: Users.dto.CheckUsernameAvailabilityInput,
	): Promise<Users.dto.CheckUsernameAvailabilityOutput> {
		const result = await this.repo.checkUsernameAvailability(data);

		return {
			available: result.available,
		};
	}
}
