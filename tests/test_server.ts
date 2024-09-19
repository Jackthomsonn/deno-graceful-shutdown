import { GracefulServer } from "../graceful-server/index.ts";

const handler = async (_req: Request): Promise<Response> => {
  await new Promise(resolve => setTimeout(() => resolve({}), 1_000));

  return new Response(JSON.stringify({ status: true }), { status: 200 });
};

export const test_server = GracefulServer({
  options: {
    port: 9094
  }
}, handler);