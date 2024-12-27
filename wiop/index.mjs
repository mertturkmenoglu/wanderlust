import { createApp, toNodeListener } from "h3";
import { createIPX, createIPXH3Handler, ipxFSStorage, ipxHttpStorage } from "ipx";
import { listen } from "listhen";

const ipx = createIPX({
  storage: ipxFSStorage({ dir: "./public" }),
  httpStorage: ipxHttpStorage({
    domains: ["localhost:9000"],
    allowAllDomains: true,
  }),
});

const app = createApp().use("/", createIPXH3Handler(ipx));

listen(toNodeListener(app), {
  port: 3002,
});
