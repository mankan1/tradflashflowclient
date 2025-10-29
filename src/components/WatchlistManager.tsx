// src/components/WatchlistManager.tsx
import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, Alert, ActivityIndicator
} from "react-native";
import { useWatchlist } from "../context/WatchlistContext";

export default function WatchlistManager() {
  const { wl, loading, error, addSymbols, removeSymbols, refresh } = useWatchlist();

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [shadowEq, setShadowEq] = useState<string[] | null>(null);

  // Render from shadow if present (optimistic), else from context
  const equities = (shadowEq ?? wl?.equities ?? []).slice().sort();

  const onAdd = async () => {
    const raw = input.trim();
    if (!raw) return;

    const toAdd = raw.split(/[,\s]+/).map(s => s.toUpperCase()).filter(Boolean);
    const original = equities.slice();

    try {
      // optimistic
      setShadowEq(Array.from(new Set([...equities, ...toAdd])));
      await addSymbols(toAdd);
      await refresh();     // authoritative
      setShadowEq(null);   // back to context
      setInput("");
    } catch (e: any) {
      setShadowEq(original); // rollback
      Alert.alert("Add failed", e?.message || String(e));
    }
  };

  const onRemove = async (sym: string) => {
    const original = equities.slice();
    try {
      setBusy(b => ({ ...b, [sym]: true }));
      // optimistic
      setShadowEq(original.filter(s => s !== sym));

      await removeSymbols([sym]);
      await refresh();     // authoritative
      setShadowEq(null);   // back to context
    } catch (e: any) {
      setShadowEq(original); // rollback
      Alert.alert("Remove failed", e?.message || String(e));
    } finally {
      setBusy(b => ({ ...b, [sym]: false }));
    }
  };

  return (
    <View style={S.wrap}>
      <Text style={S.h}>Watchlist</Text>
      {loading && <ActivityIndicator />}
      {!!error && <Text style={S.err}>{error}</Text>}

      <View style={S.row}>
        <TextInput
          placeholder="Add symbols (e.g. AAPL NVDA TSLA)"
          value={input}
          onChangeText={setInput}
          autoCapitalize="characters"
          autoCorrect={false}
          style={S.inp}
        />
        <TouchableOpacity onPress={onAdd} style={S.btn}>
          <Text style={S.btnTxt}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={refresh} style={[S.btn, S.btnGhost]}>
          <Text style={[S.btnTxt, S.btnTxtGhost]}>↻</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={equities}
        keyExtractor={(s) => s}
        renderItem={({ item }) => (
          <View style={S.item}>
            <Text style={S.sym}>{item}</Text>
            <TouchableOpacity
              disabled={!!busy[item]}
              onPress={() => onRemove(item)}
              style={[S.rm, busy[item] && { opacity: 0.6 }]}
            >
              <Text style={S.rmTxt}>{busy[item] ? "Removing…" : "Remove"}</Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={!loading ? <Text style={{ opacity: 0.6 }}>No symbols yet.</Text> : null}
      />
    </View>
  );
}

const S = StyleSheet.create({
  wrap: { padding: 12, gap: 12 },
  h: { fontSize: 18, fontWeight: "700" },
  row: { flexDirection: "row", gap: 8, alignItems: "center" },
  inp: { flex: 1, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  btn: { backgroundColor: "#111827", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  btnTxt: { color: "white", fontWeight: "600" },
  btnGhost: { backgroundColor: "transparent", borderColor: "#111827", borderWidth: 1 },
  btnTxtGhost: { color: "#111827" },
  item: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#f3f4f6", borderRadius: 10, padding: 10 },
  sym: { fontWeight: "700", letterSpacing: 0.5 },
  rm: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "#fee2e2", borderRadius: 8 },
  rmTxt: { color: "#991b1b", fontWeight: "700" },
  err: { color: "#b91c1c" }
});
