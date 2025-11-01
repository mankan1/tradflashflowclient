// src/lib/api.ts
export async function fetchJSON(path: string, init?: RequestInit) {
  //const url = path.startsWith("http") ? path : `http://localhost:8080${path}`;
  const url = path.startsWith("http") ? path : `https://tradeflashflow-production.up.railway.app${path}`;

  const r = await fetch(url, init);
  const ctype = r.headers.get("content-type") || "";
  if (!ctype.includes("application/json")) {
    const text = await r.text();
    throw new Error(`Expected JSON from ${url} but got ${ctype}. Body: ${text.slice(0,200)}`);
  }
  if (!r.ok) {
    const body = await r.text();
    throw new Error(`${r.status} ${r.statusText}: ${body}`);
  }
  return r.json();
}

