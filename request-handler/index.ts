import { Config } from "../graceful-server/types/config.ts";

export const handleReq = (handler: Response | Promise<Response>, config: Config): Promise<Response> | Response => {
  config.activeRequests++;

  const requestPromise = (() => {
    try {
      return Promise.resolve(handler);
    } finally {
      config.activeRequests--;
    }
  })();

  config.pendingRequests.push(requestPromise);

  return requestPromise;
}