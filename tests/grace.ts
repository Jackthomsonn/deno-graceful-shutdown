import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { pushToQueue, request_queue, killServer } from "./utils.ts";

Deno.test("honour first five requests gracefully and reject the last 5", async () => {
  for (let i = 1; i <= 10; ++i) {
    if (i === 5) {
      pushToQueue();
      await using _ = await testSuccess()
      await killServer();
    } else {
      pushToQueue();
    }
  }

  await using _ = await testFailure();
});

const testSuccess = async () => {
  const results = await Promise.all(request_queue);
  results.forEach(result => assertEquals(result, { status: true }));

  return {
    [Symbol.asyncDispose]: () => {
      request_queue.splice(0, request_queue.length);
      return Promise.resolve()
    }
  }
}

const testFailure = async () => {
  const results = await Promise.all(request_queue);
  results.forEach(result => assertEquals(result, undefined));

  return {
    [Symbol.asyncDispose]: () => {
      request_queue.splice(0, request_queue.length);
      return Promise.resolve()
    }
  }
}