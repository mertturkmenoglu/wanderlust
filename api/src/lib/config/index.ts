import { z } from "zod";
import { schema } from "./schema";
import { ConfigFileValidationError } from "./errors";
import { Container, type IServiceProvider } from "../di";

export class ConfigServiceProvider implements IServiceProvider<TConfig> {
  async createInstance(ioc: Container): Promise<TConfig> {
    return await init();
  }

  static getIdentifier() {
    return Container.createIdentifier<TConfig>();
  }
}

async function init(): Promise<TConfig> {
  const data = await Bun.file("./config.toml").text();

  const obj = Bun.TOML.parse(data);

  const res = schema.safeParse(obj);

  if (!res.success) {
    throw new ConfigFileValidationError("", {
      cause: z.treeifyError(res.error),
    });
  }

  return res.data;
}

export type TConfig = z.infer<typeof schema>;
