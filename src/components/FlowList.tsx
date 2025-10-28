import React from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import type { FlowMsg, SweepMsg, BlockMsg, ChainSnap } from "../types/flow";
import { fmtTime, fmtUsd, fmtQty, fmtOcc } from "../utils/format";

function Row({ item }: { item: FlowMsg }) {
  if (item.type === "sweeps") {
    const s = item as SweepMsg;
    return (
      <View style={styles.card}>
        <Text style={styles.title}>SWEEP • {s.symbol} • {s.option.right} {s.option.strike}</Text>
        <Text style={styles.meta}>
          {s.side} • {fmtQty(s.totalQty)}c • {fmtUsd(s.notional)} • {fmtOcc(s.occ)}
        </Text>
        <Text style={styles.sub}>prints: {s.prints.length} • {fmtTime(s.ts)} • {s.provider}</Text>
      </View>
    );
  }
  if (item.type === "blocks") {
    const b = item as BlockMsg;
    return (
      <View style={styles.card}>
        <Text style={styles.title}>BLOCK • {b.symbol} • {b.option.right} {b.option.strike}</Text>
        <Text style={styles.meta}>
          {b.side} • {fmtQty(b.qty)}c @ {fmtUsd(b.price)} • {fmtUsd(b.notional)} • {fmtOcc(b.occ)}
        </Text>
        <Text style={styles.sub}>{fmtTime(b.ts)} • {b.provider}</Text>
      </View>
    );
  }
  if (item.type === "chains") {
    const c = item as ChainSnap;
    return (
      <View style={styles.card}>
        <Text style={styles.title}>CHAIN • {c.symbol} • {c.expiration}</Text>
        <Text style={styles.meta}>strikes: {c.strikesCount} • sample: {c.strikes.slice(0,6).join(", ")}</Text>
        <Text style={styles.sub}>{fmtTime(c.ts)} • {c.provider}</Text>
      </View>
    );
  }
  // fallback (equity_ts / options_ts)
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.type.toUpperCase()} • {(item as any).symbol}</Text>
      <Text style={styles.sub}>{fmtTime(item.ts)} • {item.provider}</Text>
    </View>
  );
}

export default function FlowList({ data }: { data: FlowMsg[] }) {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <Row item={item} />}
      keyExtractor={(it, idx) => it.id || `${it.type}-${it.ts}-${idx}`}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      contentContainerStyle={{ padding: 12 }}
    />
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, borderRadius: 12, backgroundColor: "#fff", shadowColor:"#000", shadowOpacity:0.08, shadowRadius:6, shadowOffset:{width:0,height:2}, elevation:2 },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  meta: { fontSize: 14, fontWeight: "500" },
  sub: { fontSize: 12, opacity: 0.7, marginTop: 2 },
});

