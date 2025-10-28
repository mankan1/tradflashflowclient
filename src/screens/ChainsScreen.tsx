import React, { useEffect, useRef, useState } from "react";
import FlowList from "../components/FlowList";
import { WS_URL, WATCHLIST } from "../config";
import type { ChainSnap, FlowMsg } from "../types/flow";

export default function ChainsScreen() {
  const [items, setItems] = useState<ChainSnap[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => { fetch("/api/flow/chains").then(r => r.json()).then((arr: ChainSnap[]) => setItems(arr)); }, []);
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    ws.onopen = () => ws.send(JSON.stringify({ subscribe: ["chains"] }));
    ws.onmessage = (ev) => {
      let m: FlowMsg; try { m = JSON.parse(String(ev.data)); } catch { return; }
      if (m.type !== "chains") return;
      setItems(prev => (prev.find(x => x.id === (m as ChainSnap).id) ? prev : [m as ChainSnap, ...prev]).slice(0, 400));
    };
    return () => { try { ws.close(); } catch {} };
  }, []);

  return <FlowList data={items} />;
}

