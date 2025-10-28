import React, { useEffect, useRef, useState } from "react";
import FlowList from "../components/FlowList";
import { WS_URL, WATCHLIST } from "../config";
import type { BlockMsg, FlowMsg } from "../types/flow";

export default function BlocksScreen() {
  const [items, setItems] = useState<BlockMsg[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => { fetch("/api/flow/blocks").then(r => r.json()).then((arr: BlockMsg[]) => setItems(arr)); }, []);
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    ws.onopen = () => ws.send(JSON.stringify({ subscribe: ["blocks"] }));
    ws.onmessage = (ev) => {
      let m: FlowMsg; try { m = JSON.parse(String(ev.data)); } catch { return; }
      if (m.type !== "blocks") return;
      setItems(prev => (prev.find(x => x.id === (m as BlockMsg).id) ? prev : [m as BlockMsg, ...prev]).slice(0, 400));
    };
    return () => { try { ws.close(); } catch {} };
  }, []);

  return <FlowList data={items} />;
}

