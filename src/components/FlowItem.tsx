import React from "react";
import { View, Text } from "react-native";
import ProviderChip from "./ProviderChip";
import type { FlowMsg } from "../types";

function Pill({ label, tone }: { label: string; tone: "buy"|"sell"|"mid"|"open"|"close"|"unk" }) {
  const bg = { buy:"#dcfce7", sell:"#fee2e2", mid:"#e5e7eb", open:"#dbeafe", close:"#fef3c7", unk:"#f3f4f6" }[tone];
  const fg = { buy:"#166534", sell:"#991b1b", mid:"#111827", open:"#1e3a8a", close:"#92400e", unk:"#374151" }[tone];
  return <View style={{ backgroundColor:bg, borderRadius:999, paddingHorizontal:8, paddingVertical:2 }}>
    <Text style={{ color:fg, fontSize:12, fontWeight:"600" }}>{label}</Text>
  </View>;
}

export default function FlowItem({ m }: { m: FlowMsg }) {
  const when = new Date(m.ts).toLocaleTimeString();
  if (m.type === "equity_ts") {
    const tone = m.side === "BUY" ? "buy" : (m.side === "SELL" ? "sell" : "mid");
    return (
      <View style={{ padding:12, borderBottomWidth:1, borderBottomColor:"#eee", gap:6 }}>
        <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center" }}>
          <Text style={{ fontWeight:"700" }}>{m.symbol}</Text>
          <ProviderChip p={m.provider as any} />
        </View>
        <View style={{ flexDirection:"row", gap:8, alignItems:"center" }}>
          <Pill label={m.side} tone={tone} />
          <Text>{m.qty} @ {m.price.toFixed(2)}</Text>
        </View>
        <Text style={{ color:"#6b7280", fontSize:12 }}>{when}</Text>
      </View>
    );
  }
  if (m.type === "options_ts") {
    const opt = m.option!;
    const oc = m.action === "BTO" || m.action === "STO" ? "open"
              : (m.action === "BTC" || m.action === "STC" ? "close" : "unk");
    const sideTone = m.side === "BUY" ? "buy" : "sell";
    return (
      <View style={{ padding:12, borderBottomWidth:1, borderBottomColor:"#eee", gap:6 }}>
        <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center" }}>
          <Text style={{ fontWeight:"700" }}>
            {m.symbol} {opt.expiration} {opt.strike}{opt.right}
          </Text>
          <ProviderChip p={m.provider as any} />
        </View>
        <View style={{ flexDirection:"row", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          <Pill label={m.side} tone={sideTone as any} />
          <Pill label={m.action} tone={oc as any} />
          <Text>{m.qty} @ {m.price.toFixed(2)}</Text>
          <Text style={{ color:"#6b7280" }}>OI:{m.oi_before ?? "—"} Vol:{m.vol_before ?? "—"}</Text>
        </View>
        <Text style={{ color:"#6b7280", fontSize:12 }}>{when} {m.venue ? `· ${m.venue}` : ""}</Text>
      </View>
    );
  }
  // basic for sweeps/blocks/chains
  return (
    <View style={{ padding:12, borderBottomWidth:1, borderBottomColor:"#eee", gap:6 }}>
      <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center" }}>
        <Text style={{ fontWeight:"700" }}>{m.type.toUpperCase()}</Text>
        <ProviderChip p={(m as any).provider} />
      </View>
      <Text style={{ color:"#6b7280", fontSize:12 }}>{new Date(m.ts).toLocaleTimeString()}</Text>
    </View>
  );
}

