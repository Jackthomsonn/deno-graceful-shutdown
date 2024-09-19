import { Config } from "../graceful-server/types/config.ts";
import { handleSignals } from "./index.ts";
import { handleSignalEvent } from "./index.ts";
import { spy, assertSpyCalls, assertSpyCallArg } from "https://deno.land/std@0.177.0/testing/mock.ts";

const config: Config = {
  isShuttingDown: false,
  activeRequests: 0,
  options: {},
  pendingRequests: [new Promise(resolve => setTimeout(() => { resolve({} as Response) }, 0))],
};

Deno.test("handleSignalEvent handles graceful exit", async () => {
  const denoExitSpy = spy(Deno, 'exit')

  try {
    await using _ = await handleSignalEvent(config);
  } catch {
    assertSpyCalls(denoExitSpy, 1)
    assertSpyCallArg(denoExitSpy, 0, 0, 0)
  }
});

Deno.test('handleSignals is called for all signal codes passed', async () => {
  const addSignalListenerSpy = spy(Deno, 'addSignalListener');

  handleSignals(["SIGTERM", "SIGINT"], config);

  Deno.removeSignalListener('SIGTERM', () => { })
  Deno.removeSignalListener('SIGINT', () => { })

  assertSpyCalls(addSignalListenerSpy, 2);

  Deno.removeSignalListener('SIGTERM', () => { })
  Deno.removeSignalListener('SIGINT', () => { })

  await new Promise(resolve => setTimeout(() => resolve({}), 2_000))
})