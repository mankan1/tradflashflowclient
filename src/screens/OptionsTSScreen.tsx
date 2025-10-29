// src/screens/OptionsTSScreen.tsx
import React, { useMemo, useState } from "react";
import { View, FlatList, RefreshControl, Text } from "react-native";
import { useFlow } from "../flow/FlowProvider";
import FlowItem from "../components/FlowItem";
import QtyFilterBar, { QtyFilterConfig } from "../components/QtyFilterBar";
import { applyQtyFilters } from "../lib/applyQtyFilters";

export default function OptionsTSScreen() {
  const { items, refresh, ready } = useFlow("options_ts");

  // Default: show contracts in multiples of 10 (common for options)
  const [cfg, setCfg] = useState<QtyFilterConfig>({
    minQty: 0,
    multiplesOf: 10,
  });

  const filtered = useMemo(() => applyQtyFilters(items, cfg), [items, cfg]);

  return (
    <View style={{ flex: 1 }}>
      <QtyFilterBar
        title="Options Filters"
        initialMin={0}
        initialMultiples={10}
        onChange={setCfg}
      />

      <FlatList
        data={filtered}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => <FlowItem m={item} />}
        refreshControl={
          // refresh() already bound to "options_ts" by useFlow
          <RefreshControl refreshing={!ready} onRefresh={refresh} />
        }
        ListEmptyComponent={
          ready ? (
            <Text style={{ textAlign: "center", marginTop: 16, opacity: 0.6 }}>
              No prints match the current filters.
            </Text>
          ) : null
        }
      />
    </View>
  );
}

