import { Disk } from "flydrive";
import { FSDriver } from "flydrive/drivers/fs";
import type { SignedURLOptions } from "flydrive/types";
import { Container, type IServiceProvider } from "../di";
import { ConfigServiceProvider, type TConfig } from "../config";

export class StorageServiceProvider
  implements IServiceProvider<TStorageService>
{
  createInstance(ioc: Container) {
    const cfg = ioc.resolve(ConfigServiceProvider.getIdentifier());
    return init(cfg);
  }

  static getIdentifier() {
    return Container.createIdentifier<TStorageService>();
  }
}

function init(cfg: TConfig) {
  const fsDriver = new FSDriver({
    location: new URL("../../../uploads", import.meta.url),
    visibility: "public",
    urlBuilder: {
      async generateURL(key: string, _filePath: string) {
        return `${cfg.api.url}/uploads/${key}`;
      },

      async generateSignedURL(
        key: string,
        _filePath: string,
        _options: SignedURLOptions
      ) {
        /**
         * It is up to your application to decide how to create and verify
         * signed URLs. Do note this method can be async.
         */
        return `${cfg.api.url}/uploads/${key}`;
      },
    },
  });

  return new Disk(fsDriver);
}

export type TStorageService = ReturnType<typeof init>;
