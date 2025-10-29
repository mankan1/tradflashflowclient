import { WS_URL } from "../config";
import { useEffect, useRef } from "react";

type MsgHandler = (m: any) => void;

export function useFlowSocket(onMsg: MsgHandler) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const heartbeatRef = useRef<number | null>(null);
  const backoffRef = useRef(400);           // start small, ms
  const closingRef = useRef(false);         // true when cleanup intentionally closes
  const mountedRef = useRef(false);

  const clearTimers = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  };

  useEffect(() => {
    if (mountedRef.current) return; // avoid Strict Mode double-connect churn
    mountedRef.current = true;
    closingRef.current = false;

    function subscribeAll(ws: WebSocket) {
      try {
        ws.send(JSON.stringify({
          subscribe: ["equity_ts", "options_ts", "sweeps", "blocks", "chains"]
        }));
      } catch {}
    }

    function scheduleReconnect(reason?: string) {
      if (closingRef.current) return;
      clearTimers();
      const delay = Math.min(backoffRef.current + Math.floor(Math.random() * 200), 5000);
      backoffRef.current = Math.min(backoffRef.current * 1.6, 5000);
      reconnectTimerRef.current = window.setTimeout(connect, delay) as unknown as number;
      if (reason) console.warn("[WS] reconnect in", delay, "ms –", reason);
    }

    function connect() {
      // If an old socket is still CONNECTING/OPEN, don’t create another.
      const prev = wsRef.current;
      if (prev && (prev.readyState === WebSocket.CONNECTING || prev.readyState === WebSocket.OPEN)) {
        return;
      }

      try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          backoffRef.current = 400; // reset backoff
          // keep-alive ping (some proxies drop idle WS)
          clearTimers();
          heartbeatRef.current = window.setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              try { ws.send('{"ping":1}'); } catch {}
            }
          }, 25_000) as unknown as number;

          subscribeAll(ws);
        };

        ws.onmessage = (ev) => {
          try {
            const m = JSON.parse(String(ev.data));
            onMsg(m);
          } catch (e) {
            // ignore parse errors
          }
        };

        ws.onerror = (e: any) => {
          // “Insufficient resources” or other transient errors — let onclose handle reconnect
          // Some browsers fire both onerror and onclose; don’t double-handle.
        };

        ws.onclose = (ev) => {
          clearTimers();
          if (!closingRef.current) {
            // 1006, 1013 often map to transient / capacity issues
            scheduleReconnect(ev.reason || `code=${ev.code}`);
          }
        };
      } catch (e: any) {
        scheduleReconnect(e?.message || "constructor failed");
      }
    }

    connect();

    return () => {
      closingRef.current = true;
      clearTimers();
      const ws = wsRef.current;
      // Only close if OPEN; if CONNECTING, just null it and let it fail naturally.
      if (ws && ws.readyState === WebSocket.OPEN) {
        try { ws.close(1000, "unmount"); } catch {}
      }
      wsRef.current = null;
    };
  }, [onMsg]);

  return wsRef;
}

