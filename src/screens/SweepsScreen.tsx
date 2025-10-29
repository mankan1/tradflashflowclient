import React, { useEffect, useRef, useState } from "react";
import FlowList from "../components/FlowList";
import { WS_URL, API_BASE } from "../config"; // <- make sure API_BASE points to :8080
import type { SweepMsg, FlowMsg } from "../types/flow";

export default function SweepsScreen() {
  const [items, setItems] = useState<SweepMsg[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // initial backfill (use absolute API_BASE and verify content-type)
  useEffect(() => {
    (async () => {
      try {
        const url = `${API_BASE}/api/flow/sweeps`;
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        const ctype = res.headers.get("content-type") || "";
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status} from ${url}\n${text.slice(0,400)}`);
        }
        if (!ctype.includes("application/json")) {
          const text = await res.text().catch(() => "");
          throw new Error(`Expected JSON from ${url} but got ${ctype}\n${text.slice(0,400)}`);
        }
        const arr = (await res.json()) as SweepMsg[];
        setItems(Array.isArray(arr) ? arr : []);
      } catch (e: any) {
        setErr(e?.message ?? String(e));
      }
    })();
  }, []);

  // WS live (WS_URL should be ws(s)://host:8080/ws)
  useEffect(() => {
    let closed = false;
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!closed) ws.send(JSON.stringify({ subscribe: ["sweeps"] }));
    };

    ws.onmessage = (ev) => {
      try {
        const m = JSON.parse(String(ev.data)) as FlowMsg;
        if (m.type !== "sweeps") return;
        setItems(prev =>
          (prev.find(x => x.id === (m as SweepMsg).id) ? prev : [m as SweepMsg, ...prev]).slice(0, 400)
        );
      } catch {
        /* ignore parse errors */
      }
    };

    ws.onerror = () => {
      // optional: surface a soft error, but don't spam UI
    };

    ws.onclose = () => {
      // optional: you likely have a global socket already; if you need local retry:
      // setTimeout(() => { if (!closed) ...reconnect... }, 800);
    };

    return () => {
      closed = true;
      try { ws.close(); } catch {}
    };
  }, []);

  // Optional: show a tiny error banner if the initial backfill failed
  return (
    <>
      {err ? <div style={{ padding: 8, color: "#b91c1c" }}>{err}</div> : null}
      <FlowList data={items} />
    </>
  );
}

