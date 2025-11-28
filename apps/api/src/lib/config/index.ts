import { z } from "zod";
import { schema } from "./schema";
import { ConfigFileValidationError } from "./errors";
import { Container, type IServiceProvider } from "../di";

export class ConfigProvider implements IServiceProvider<TConfig> {
  static async createInstance(ioc: Container) {
    return await init();
  }

  static get id() {
    return Container.createIdentifier<TConfig>("config");
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
