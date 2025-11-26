import type { CategoriesRepository } from "./repository";
import * as dto from "./dto";

export class CategoriesService {
  constructor(private readonly repository: CategoriesRepository) {}

  async list(): Promise<dto.ListOutput> {
    const result = await this.repository.list();

    return {
      cities: result,
    };
  }

  async listFeatured(): Promise<dto.ListFeaturedOutput> {
    const result = await this.repository.listFeatured();

    return {
      cities: result,
    };
  }

  async get(data: dto.GetInput): Promise<dto.GetOutput> {
    const result = await this.repository.get(data);

    return {
      city: result,
    };
  }

  async create(data: dto.CreateInput): Promise<dto.CreateOutput> {
    const result = await this.repository.create(data);

    return {
      city: result,
    };
  }

  async update(data: dto.UpdateInput): Promise<dto.UpdateOutput> {
    const result = await this.repository.update(data);

    return {
      city: result,
    };
  }

  async _delete(data: dto.DeleteInput): Promise<void> {
    await this.repository._delete(data);
  }
}
