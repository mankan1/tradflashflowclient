import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { WS_URL, WATCHLIST } from "../config";
import { getJSON, postJSON } from "../lib/http";
import type { FlowMsg, FlowType } from "../types";

type Ctx = { data: Record<FlowType, FlowMsg[]>; refresh: (t: FlowType) => Promise<void>; ready: boolean; };
const FlowContext = createContext<Ctx | null>(null);

const TYPES: FlowType[] = ["options_ts","equity_ts","sweeps","blocks","chains"];
const MAX_LEN = 400;

export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Record<FlowType, FlowMsg[]>>({ options_ts: [], equity_ts: [], sweeps: [], blocks: [], chains: [] });
  const [ready, setReady] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const connectingRef = useRef(false);
  const startedWatchRef = useRef(false);

  const push = (m: FlowMsg) => {
    if (!TYPES.includes(m.type)) return;
    setData(prev => {
      const arr = [m, ...prev[m.type]];
      if (arr.length > MAX_LEN) arr.length = MAX_LEN;
      return { ...prev, [m.type]: arr };
    });
  };

  const connect = () => {
    if (connectingRef.current) return;
    connectingRef.current = true;
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    ws.onopen = () => { ws.send(JSON.stringify({ subscribe: TYPES })); setReady(true); };
    ws.onmessage = (e) => { try { push(JSON.parse(String(e.data)) as FlowMsg); } catch {} };
    ws.onclose = () => { setReady(false); wsRef.current = null; connectingRef.current = false; setTimeout(connect, 800); };
    ws.onerror = () => {};
  };

  useEffect(() => {
    // backfill, then watch, then ws
    Promise.all(TYPES.map(async (t) => ({ t, list: await getJSON<FlowMsg[]>(`/api/flow/${t}`) })))
      .then(pairs => {
        setData(prev => {
          const next = { ...prev };
          for (const { t, list } of pairs) next[t as FlowType] = list ?? [];
          return next;
        });
        if (!startedWatchRef.current) {
          startedWatchRef.current = true;
          postJSON("/watch/alpaca", WATCHLIST.alpaca).catch(()=>{});
          postJSON("/watch/tradier", WATCHLIST.tradier).catch(()=>{});
        }
        connect();
      })
      .catch(() => connect());
    return () => { wsRef.current?.close(); };
  }, []);

  const refresh = async (type: FlowType) => {
    const list = await getJSON<FlowMsg[]>(`/api/flow/${type}`);
    setData(prev => ({ ...prev, [type]: list ?? [] }));
  };

  const value = useMemo(() => ({ data, refresh, ready }), [data, ready]);
  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

export function useFlow(type: FlowType) {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error("useFlow must be used within FlowProvider");
  return { items: ctx.data[type], refresh: () => ctx.refresh(type), ready: ctx.ready };
}

