// src/screens/EquityTSScreen.tsx
import React, { useMemo, useState } from "react";
import { View, FlatList, RefreshControl, Text } from "react-native";
import { useFlow } from "../flow/FlowProvider";
import FlowItem from "../components/FlowItem";
import QtyFilterBar, { QtyFilterConfig } from "../components/QtyFilterBar";
import { applyQtyFilters } from "../lib/applyQtyFilters";

export default function EquityTSScreen() {
  const { items, refresh, ready } = useFlow("equity_ts");

  // Default: show share prints in multiples of 100 (round lots)
  const [cfg, setCfg] = useState<QtyFilterConfig>({
    minQty: 0,
    multiplesOf: 100,
  });

  const filtered = useMemo(() => applyQtyFilters(items, cfg), [items, cfg]);

  return (
    <View style={{ flex: 1 }}>
      <QtyFilterBar
        title="Equity Filters"
        initialMin={0}
        initialMultiples={100}
        onChange={setCfg}
      />

      <FlatList
        data={filtered}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => <FlowItem m={item} />}
        refreshControl={
          // useFlow already scopes refresh to "equity_ts"
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

