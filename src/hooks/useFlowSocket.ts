// src/hooks/useFlowSocket.ts
import { useEffect, useRef } from "react";
export function useFlowSocket(onMsg: (m: any) => void) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const url =
      typeof window !== "undefined"
        ? `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}`
        : "ws://localhost:8080"; // adjust for device/simulator

    let ws = new WebSocket(url);
    wsRef.current = ws;

    const subscribeAll = () => {
      ws.send(JSON.stringify({
        subscribe: ["equity_ts","options_ts","sweeps","blocks","chains"]
      }));
    };

    ws.onopen = () => subscribeAll();

    ws.onmessage = (ev) => {
      try { onMsg(JSON.parse(String(ev.data))); } catch {}
    };

    ws.onclose = () => {
      // quick retry
      setTimeout(() => {
        ws = new WebSocket(url);
        wsRef.current = ws;
        ws.onopen = () => subscribeAll();
        ws.onmessage = (ev) => {
          try { onMsg(JSON.parse(String(ev.data))); } catch {}
        };
      }, 800);
    };

    return () => { try { ws.close(); } catch {} };
  }, [onMsg]);

  return wsRef;
}

