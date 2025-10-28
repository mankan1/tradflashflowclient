export type FlowType = "options_ts" | "equity_ts" | "sweeps" | "blocks" | "chains";

export type OptionsTSMsg = {
  id: string; ts: number; type: "options_ts";
  provider: string; symbol: string;
  option: { expiration: string; strike: number; right: "C" | "P" };
  side: "BUY" | "SELL";
  qty: number; price: number;
  action: "BTO" | "STO" | "BTC" | "STC" | "UNK";
  oi_before?: number; vol_before?: number; venue?: string | null;
};

export type EquityTSMsg = {
  id: string; ts: number; type: "equity_ts";
  provider: string; symbol: string;
  side: "BUY" | "SELL" | "MID";
  qty: number; price: number; action: "UNK"; venue?: string | null;
};

export type BasicMsg = {
  id: string; ts: number; type: "sweeps" | "blocks" | "chains";
  provider?: string; [k: string]: any;
};

export type FlowMsg = OptionsTSMsg | EquityTSMsg | BasicMsg;

