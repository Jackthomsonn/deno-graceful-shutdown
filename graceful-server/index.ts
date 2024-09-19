import { handleReq } from "../request-handler/index.ts";
import { handleSignals } from "../signals/index.ts";
import { GracefulServerConfig } from "./types/config.ts";

export const GracefulServer = async (config: GracefulServerConfig, handler: Deno.ServeHandler) => {
  const fullConfig = {
    ...{
      activeRequests: 0,
      isShuttingDown: false,
      pendingRequests: [],
      options: {}
    }, ...config,
  }

  const serverPromise = Deno.serve(config.options, (req, info) => handleReq(handler(req, info), fullConfig));

  handleSignals(['SIGINT', 'SIGTERM'], fullConfig);

  await serverPromise.finished;
}