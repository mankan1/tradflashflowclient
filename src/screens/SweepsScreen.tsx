import React, { useEffect, useRef, useState } from "react";
import FlowList from "../components/FlowList";
import { WS_URL, WATCHLIST } from "../config";
import type { SweepMsg, FlowMsg } from "../types/flow";

export default function SweepsScreen() {
  const [items, setItems] = useState<SweepMsg[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  // initial backfill
  useEffect(() => {
    fetch("/api/flow/sweeps").then(r => r.json()).then((arr: SweepMsg[]) => setItems(arr));
  }, []);

  // WS live
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    ws.onopen = () => ws.send(JSON.stringify({ subscribe: ["sweeps"] }));
    ws.onmessage = (ev) => {
      let m: FlowMsg; try { m = JSON.parse(String(ev.data)); } catch { return; }
      if (m.type !== "sweeps") return;
      setItems(prev => (prev.find(x => x.id === (m as SweepMsg).id) ? prev : [m as SweepMsg, ...prev]).slice(0, 400));
    };
    return () => { try { ws.close(); } catch {} };
  }, []);

  return <FlowList data={items} />;
}

