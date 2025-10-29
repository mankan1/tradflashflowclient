// src/flow/ws-singleton.ts
let _ws: WebSocket | null = null;
let _connecting = false;
let _listeners: ((m:any)=>void)[] = [];

function wsUrl(): string {
  if (typeof window === "undefined") return "ws://localhost:8080/ws";
  const secure = location.protocol === "https:";
  return `${secure ? "wss" : "ws"}://${location.hostname}:8080/ws`;
}

export function getFlowSocket(addListener?: (m:any)=>void): WebSocket {
  if (addListener) _listeners.push(addListener);
  if (_ws && _ws.readyState === WebSocket.OPEN) return _ws;
  if (_connecting) return _ws!;

  _connecting = true;
  const ws = new WebSocket(wsUrl());
  _ws = ws;

  const subscribeAll = () => {
    ws.send(JSON.stringify({ subscribe: ["equity_ts","options_ts","sweeps","blocks","chains"] }));
  };

  ws.onopen = () => { subscribeAll(); };
  ws.onmessage = (ev) => {
    try {
      const msg = JSON.parse(String(ev.data));
      for (const fn of _listeners) fn(msg);
    } catch {}
  };
  ws.onclose = (ev) => {
    console.warn(`[WS] closed code=${ev.code} (reconnecting)`);
    _connecting = false;
    _ws = null;
    setTimeout(() => getFlowSocket(), 1000 + Math.random()*1000);
  };
  ws.onerror = (e) => {
    console.warn("[WS] error", e);
  };

  return ws;
}
