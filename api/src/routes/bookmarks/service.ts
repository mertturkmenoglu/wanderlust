import type { BookmarksRepository } from "./repository";
import * as dto from "./dto";

export class BookmarksService {
  constructor(private readonly repo: BookmarksRepository) {}

  async create(
    userId: string,
    data: dto.CreateInput
  ): Promise<dto.CreateOutput> {
    const result = await this.repo.create(userId, data);

    return {
      bookmark: result,
    };
  }

  async list(userId: string, data: dto.ListInput): Promise<dto.ListOutput> {
    const result = await this.repo.list(userId, data);

    return {
      bookmarks: result.bookmarks,
      pagination: result.pagination,
    };
  }

  async _delete(
    userId: string,
    data: dto.DeleteInput
  ): Promise<dto.DeleteOutput> {
    await this.repo._delete(userId, data);

    return {};
  }
}
