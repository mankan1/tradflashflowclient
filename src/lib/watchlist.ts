// src/lib/watchlist.ts
import { getJSON, postJSON, delJSON } from "./http";

export type Watchlist = {
  equities: string[];
  options: { underlying: string; expiration: string; strike: number; right: "CALL"|"PUT" }[];
};

export const fetchWatchlist = () => getJSON<Watchlist>("/watchlist");

export const addEquities = (symbols: string[]) =>
  postJSON("/watch/symbols", { symbols });


export const removeEquities = async (symbols: string[]) => {
  try {
    return await delJSON("/watch/symbols", { symbols });
  } catch {
    // Fallback for environments that drop DELETE bodies
    return await postJSON("/unwatch/symbols", { symbols });
  }
};

export const addOptions = (options: Watchlist["options"]) =>
  postJSON("/watch/tradier", { options });

export const removeOptions = (options: Watchlist["options"]) =>
  delJSON("/watch/tradier", { options });

