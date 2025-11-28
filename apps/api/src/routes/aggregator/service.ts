import type { AggregatorRepository } from "./repository";
import * as dto from "./dto";
import type { TCacheService } from "@/lib/cache";

export class AggregatorService {
  private readonly ns = "aggregator";

  constructor(
    private readonly cache: TCacheService,
    private readonly repo: AggregatorRepository
  ) {}

  async home(): Promise<dto.HomeOutput> {
    const result = await this.cache.namespace(this.ns).getOrSet({
      key: "home",
      ttl: "1h",
      factory: async () => this.repo.home(),
      grace: "1h",
    });

    return result;
  }
}
