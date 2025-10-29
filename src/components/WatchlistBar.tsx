// src/components/WatchlistBar.tsx
import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from "react-native";
import { useFlow } from "../flow/FlowProvider";

export default function WatchlistBar() {
  const { watches, addEquities, removeEquities } = useFlow();
  const [input, setInput] = useState("");
  const list = useMemo(() => Array.from(watches.equities).sort(), [watches.equities]);

  return (
    <View style={{ padding: 10, gap: 8 }}>
      <Text style={{ fontWeight: "600" }}>Watchlist</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Add symbol (AAPL, NVDA...)"
          autoCapitalize="characters"
          style={{ borderWidth: 1, padding: 8, flex: 1 }}
        />
        <Button title="Add" onPress={() => {
          const syms = input.split(/[,\s]+/).map(s => s.trim()).filter(Boolean);
          if (syms.length) addEquities(syms).catch(console.warn);
          setInput("");
        }} />
      </View>
      <FlatList
        data={list}
        keyExtractor={(s) => s}
        horizontal
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, marginRight: 8 }}>
            <Text>{item}</Text>
            <TouchableOpacity onPress={() => removeEquities([item]).catch(console.warn)}>
              <Text style={{ marginLeft: 8, color: "red" }}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

