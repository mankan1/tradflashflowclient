// Change HOST to your machine IP when testing on device
const HOST = "localhost";
const PORT = 8080;

export const API_BASE = `https://tradeflashflow-production.up.railway.app`;
export const WS_URL   = `wss://tradeflashflow-production.up.railway.app/`;

//export const API_BASE = `http://${HOST}:${PORT}`;
//export const WS_URL   = `ws://${HOST}:${PORT}/`;

export const WATCHLIST = {
  alpaca: { equities: ["SPY", "$SPX", "$NDX", "$DJX"] },
  tradier: {
    options: [
      { underlying: "AAPL", expiration: "2025-12-19", strike: 200, right: "C" },
      { underlying: "NVDA", expiration: "2025-12-19", strike: 150, right: "P" }
    ]
  }
};

