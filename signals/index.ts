import { Config } from "../graceful-server/types/config.ts";

export const handleSignalEvent = async (config: Config) => {
  config.isShuttingDown = true;

  await Promise.all(config.pendingRequests);
  await new Promise(resolve => setTimeout(() => resolve({}), 0));

  return {
    [Symbol.asyncDispose]: () => {
      Deno.exit(0)
    }
  }
}

export const handleSignals = (signals: Deno.Signal[], config: Config) => {
  for (const signal of signals) {
    Deno.addSignalListener(signal, async () => {
      await using _ = await handleSignalEvent(config);
    });
  }
}