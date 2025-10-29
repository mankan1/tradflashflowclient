// src/flow/FlowSocket.ts
let socketSingleton: WebSocket | null = null;
let listeners = new Set<(m: any) => void>();

export function connectFlowSocket(url: string) {
  if (socketSingleton) return socketSingleton;

  const ws = new WebSocket(url);            // url must be ws://host:8080/ws
  socketSingleton = ws;

  const subscribeAll = () => {
    try {
      ws.send(JSON.stringify({
        subscribe: ["equity_ts","options_ts","sweeps","blocks","chains"]
      }));
    } catch {}
  };

  ws.onopen = subscribeAll;

  ws.onmessage = (ev) => {
    let m: any; try { m = JSON.parse(String(ev.data)); } catch { return; }
    for (const fn of listeners) fn(m);
  };

  ws.onclose = () => {
    socketSingleton = null;
    // simple backoff reconnect
    setTimeout(() => connectFlowSocket(url), 1200);
  };

  ws.onerror = () => { /* swallow; onclose will reconnect */ };

  return ws;
}

export function addFlowListener(fn: (m:any)=>void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
