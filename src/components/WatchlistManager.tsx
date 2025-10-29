// src/components/WatchlistManager.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useWatchlist } from "../context/WatchlistContext";

export default function WatchlistManager() {
  const { wl, loading, error, addSymbols, removeSymbols, refresh } = useWatchlist();
  const [input, setInput] = useState("");

  const onAdd = async () => {
    const raw = input.trim();
    if (!raw) return;
    const symbols = raw.split(/[,\s]+/).map(s => s.toUpperCase()).filter(Boolean);
    try { await addSymbols(symbols); setInput(""); }
    catch (e: any) { Alert.alert("Add failed", e?.message || String(e)); }
  };
  const onRemove = async (sym: string) => {
    try { await removeSymbols([sym]); }
    catch (e: any) { Alert.alert("Remove failed", e?.message || String(e)); }
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
          style={S.inp}
        />
        <TouchableOpacity onPress={onAdd} style={S.btn}><Text style={S.btnTxt}>Add</Text></TouchableOpacity>
        <TouchableOpacity onPress={refresh} style={[S.btn, S.btnGhost]}><Text style={[S.btnTxt, S.btnTxtGhost]}>↻</Text></TouchableOpacity>
      </View>

      <FlatList
        data={(wl?.equities ?? []).sort()}
        keyExtractor={(s) => s}
        renderItem={({ item }) => (
          <View style={S.item}>
            <Text style={S.sym}>{item}</Text>
            <TouchableOpacity onPress={() => onRemove(item)} style={S.rm}><Text style={S.rmTxt}>Remove</Text></TouchableOpacity>
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

