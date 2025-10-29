// src/screens/ChainsScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import FlowList from "../components/FlowList";
import { WS_URL, API_BASE } from "../config"; // use API_BASE for REST, WS_URL for socket
import type { ChainSnap, FlowMsg } from "../types/flow";

export default function ChainsScreen() {
  const [items, setItems] = useState<ChainSnap[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Initial backfill with content-type guard (prevents "<!DOCTYPE ..." JSON errors)
  useEffect(() => {
    (async () => {
      try {
        const url = `${API_BASE}/api/flow/chains`;
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        const ctype = res.headers.get("content-type") || "";
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status} from ${url}\n${text.slice(0, 400)}`);
        }
        if (!ctype.includes("application/json")) {
          const text = await res.text().catch(() => "");
          throw new Error(`Expected JSON from ${url} but got ${ctype}\n${text.slice(0, 400)}`);
        }
        const arr = (await res.json()) as ChainSnap[];
        setItems(Array.isArray(arr) ? arr : []);
      } catch (e: any) {
        setErr(e?.message ?? String(e));
      }
    })();
  }, []);

  // Live WS stream
  useEffect(() => {
    let closed = false;
    const ws = new WebSocket(WS_URL); // e.g. ws://localhost:8080/ws
    wsRef.current = ws;

    ws.onopen = () => {
      if (!closed) ws.send(JSON.stringify({ subscribe: ["chains"] }));
    };

    ws.onmessage = (ev) => {
      try {
        const m = JSON.parse(String(ev.data)) as FlowMsg;
        if (m.type !== "chains") return;
        const msg = m as unknown as ChainSnap;
        setItems((prev) => {
          const id = (msg as any).id as string | undefined;
          if (id && prev.some(x => (x as any).id === id)) return prev; // de-dupe
          return [msg, ...prev].slice(0, 400);
        });
      } catch {
        // ignore parse errors
      }
    };

    ws.onerror = () => {
      // optional: surface a soft error
    };

    return () => {
      closed = true;
      try { ws.close(); } catch {}
    };
  }, []);

  return (
    <>
      {err ? <div style={{ padding: 8, color: "#b91c1c" }}>{err}</div> : null}
      <FlowList data={items} />
    </>
  );
}

