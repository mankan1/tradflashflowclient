// src/components/QtyFilterBar.tsx
import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export type QtyFilterConfig = {
  minQty: number;
  multiplesOf: 0 | 10 | 100; // 0 = no multiples filter
};

type Props = {
  title?: string;
  initialMin?: number;
  initialMultiples?: 0 | 10 | 100;
  // optional callback when filters change
  onChange?: (cfg: QtyFilterConfig) => void;
};

export default function QtyFilterBar({
  title = "Filters",
  initialMin = 0,
  initialMultiples = 0,
  onChange,
}: Props) {
  const [minQty, setMinQty] = useState(initialMin);
  const [multiplesOf, setMultiplesOf] = useState<0 | 10 | 100>(initialMultiples);

  const cfg = useMemo<QtyFilterConfig>(() => ({ minQty, multiplesOf }), [minQty, multiplesOf]);

  const emit = (next: QtyFilterConfig) => {
    onChange?.(next);
  };

  const bump = (delta: number) => {
    const next = Math.max(0, minQty + delta);
    setMinQty(next);
    emit({ minQty: next, multiplesOf });
  };

  const toggleMultiples = (m: 0 | 10 | 100) => {
    const next = (multiplesOf === m) ? 0 : m;
    setMultiplesOf(next);
    emit({ minQty, multiplesOf: next });
  };

  return (
    <View style={S.wrap}>
      <Text style={S.title}>{title}</Text>

      <View style={S.row}>
        <Text style={S.label}>Min Qty:</Text>
        <View style={S.btnRow}>
          <Chip onPress={() => bump(-100)} text="-100" />
          <Chip onPress={() => bump(-10)} text="-10" />
          <Text style={S.value}>{minQty}</Text>
          <Chip onPress={() => bump(+10)} text="+10" primary />
          <Chip onPress={() => bump(+100)} text="+100" primary />
        </View>
      </View>

      <View style={S.row}>
        <Text style={S.label}>Multiples:</Text>
        <View style={S.btnRow}>
          <ToggleChip
            active={multiplesOf === 10}
            onPress={() => toggleMultiples(10)}
            text="×10"
          />
          <ToggleChip
            active={multiplesOf === 100}
            onPress={() => toggleMultiples(100)}
            text="×100"
          />
          <ToggleChip
            active={multiplesOf === 0}
            onPress={() => toggleMultiples(0)}
            text="Any"
          />
        </View>
      </View>
    </View>
  );
}

function Chip({ text, onPress, primary }: { text: string; onPress: () => void; primary?: boolean }) {
  return (
    <TouchableOpacity onPress={onPress} style={[S.chip, primary && S.chipPrimary]}>
      <Text style={[S.chipText, primary && S.chipTextPrimary]}>{text}</Text>
    </TouchableOpacity>
  );
}

function ToggleChip({ text, active, onPress }: { text: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[S.chip, active && S.chipActive]}>
      <Text style={[S.chipText, active && S.chipTextActive]}>{text}</Text>
    </TouchableOpacity>
  );
}

const S = StyleSheet.create({
  wrap: { padding: 10, gap: 8, backgroundColor: "#f8fafc", borderBottomWidth: 1, borderColor: "#e5e7eb" },
  title: { fontWeight: "800", fontSize: 14, opacity: 0.9 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { fontSize: 13, fontWeight: "600" },
  btnRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: "#e5e7eb" },
  chipActive: { backgroundColor: "#111827" },
  chipText: { fontSize: 12, fontWeight: "700", color: "#111827" },
  chipTextActive: { color: "white" },
  chipPrimary: { backgroundColor: "#111827" },
  chipTextPrimary: { color: "white" },
  value: { minWidth: 40, textAlign: "center", fontVariant: ["tabular-nums"], fontWeight: "800" },
});

