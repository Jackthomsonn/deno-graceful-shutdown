type Response = {
  status: boolean;
}

import { exec } from "https://deno.land/x/exec@0.0.5/mod.ts";

export const request_queue: Promise<Response>[] = [];

export const pushToQueue = () => request_queue.push(fetchData());

export const killServer = () => exec(`kill ${Deno.args[0]}`);

export const fetchData = async (): Promise<Response> => {
  let result;

  try {
    const data = await fetch('http://localhost:9094')
    result = await data.json();
  } catch {
    // New connections
  }

  return result;
}