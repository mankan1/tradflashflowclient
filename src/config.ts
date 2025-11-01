// Change HOST to your machine IP when testing on device
const HOST = "localhost";
const PORT = 8080;

export const API_BASE = `https://tradeflashflow-production.up.railway.app`;
export const WS_URL   = `wss://tradeflashflow-production.up.railway.app/`;

//export const API_BASE = `http://${HOST}:${PORT}`;
//export const WS_URL   = `ws://${HOST}:${PORT}/`;

export const WATCHLIST = {
  alpaca: { equities: ["SPY", "QQQ", "DIA", "IWM", "VOO", "IVV"] },
  tradier: {
    options: [
      { underlying: "SPY", expiration: "2025-12-19", strike: 700, right: "C" },
      { underlying: "$SPX", expiration: "2025-12-19", strike: 6900, right: "C" }
      { underlying: "$NDX", expiration: "2025-12-19", strike: 26100, right: "C" }
      { underlying: "SPY", expiration: "2025-12-19", strike: 650, right: "P" },
      { underlying: "$SPX", expiration: "2025-12-19", strike: 6820, right: "P" }
      { underlying: "$NDX", expiration: "2025-12-19", strike: 25500, right: "P" }
    ]
  }
};

