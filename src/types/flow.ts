export type BaseMsg = {
  id: string;
  ts: number;
  type: "options_ts" | "equity_ts" | "sweeps" | "blocks" | "chains";
  provider: "alpaca" | "tradier" | string;
};

export type OptionsTs = BaseMsg & {
  type: "options_ts";
  symbol: string;               // underlying
  occ: string;                  // e.g. AAPL251219C00200000
  option: { expiration: string; strike: number; right: "CALL" | "PUT" };
  side: "BUY" | "SELL";
  qty: number;
  price: number;
  action: "BTO" | "STO" | "BTC" | "STC" | "UNK";
  oi_before?: number;
  vol_before?: number;
  venue?: string | null;
};

export type SweepMsg = BaseMsg & {
  type: "sweeps";
  symbol: string;               // underlying
  occ: string;
  option: OptionsTs["option"];
  side: OptionsTs["side"];
  totalQty: number;
  notional: number;             // price*qty*100 aggregated
  prints: Array<{ ts: number; qty: number; price: number; venue?: string | null }>;
};

export type BlockMsg = BaseMsg & {
  type: "blocks";
  symbol: string;
  occ: string;
  option: OptionsTs["option"];
  side: OptionsTs["side"];
  qty: number;
  price: number;
  notional: number;
};

export type ChainSnap = BaseMsg & {
  type: "chains";
  symbol: string;
  expiration: string;
  strikes: number[];
  strikesCount: number;
};

export type EquityTs = BaseMsg & {
  type: "equity_ts";
  symbol: string;
  side: "BUY" | "SELL" | "MID";
  qty: number;
  price: number;
  venue?: string | null;
};

export type FlowMsg = OptionsTs | EquityTs | SweepMsg | BlockMsg | ChainSnap;

