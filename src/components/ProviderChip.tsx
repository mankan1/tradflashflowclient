import React from "react";
import { Text, View } from "react-native";

export default function ProviderChip({ p }: { p?: "tradier" | "alpaca" | string }) {
  const isAlpaca = p === "alpaca";
  return (
    <View style={{
      backgroundColor: isAlpaca ? "#e0f2fe" : "#e5e7eb",
      borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2
    }}>
      <Text style={{ color: isAlpaca ? "#155e75" : "#111827", fontSize: 12 }}>{p ?? "—"}</Text>
    </View>
  );
}

