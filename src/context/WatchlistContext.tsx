// src/context/WatchlistContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Watchlist } from "../lib/watchlist";
import { fetchWatchlist, addEquities, removeEquities, addOptions, removeOptions } from "../lib/watchlist";

type Ctx = {
  wl: Watchlist | null;
  loading: boolean;
  error?: string;
  addSymbols: (symbols: string[]) => Promise<void>;
  removeSymbols: (symbols: string[]) => Promise<void>;
  addOptionContracts: (opts: Watchlist["options"]) => Promise<void>;
  removeOptionContracts: (opts: Watchlist["options"]) => Promise<void>;
  refresh: () => Promise<void>;
};

const WatchlistContext = createContext<Ctx | null>(null);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [wl, setWl] = useState<Watchlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState<string|undefined>();

  const load = async () => {
    setLoading(true);
    setErr(undefined);
    try { setWl(await fetchWatchlist()); }
    catch (e: any) { setErr(e?.message || "Failed to load watchlist"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const doAdd = async (symbols: string[]) => {
    await addEquities(symbols);
    await load();
  };
  const doRemove = async (symbols: string[]) => {
    await removeEquities(symbols);
    await load();
  };
  const doAddOpts = async (opts: Watchlist["options"]) => {
    await addOptions(opts);
    await load();
  };
  const doRemoveOpts = async (opts: Watchlist["options"]) => {
    await removeOptions(opts);
    await load();
  };

  const value = useMemo<Ctx>(() => ({
    wl, loading, error,
    addSymbols: doAdd,
    removeSymbols: doRemove,
    addOptionContracts: doAddOpts,
    removeOptionContracts: doRemoveOpts,
    refresh: load,
  }), [wl, loading, error]);

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used within WatchlistProvider");
  return ctx;
}

