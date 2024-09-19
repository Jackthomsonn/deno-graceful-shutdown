type InternalConfig = {
  isShuttingDown: boolean;
  activeRequests: number;
  pendingRequests: Promise<Response>[];
}

export type GracefulServerConfig = {
  options: Deno.ServeOptions
}

export type Config = InternalConfig & GracefulServerConfig;