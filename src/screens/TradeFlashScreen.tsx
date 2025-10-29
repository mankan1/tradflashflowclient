import React, { useMemo } from "react";
import { View, FlatList } from "react-native";
import { useFlow } from "../flow/FlowProvider";
import FlowItem from "../components/FlowItem";

export default function TradeFlashScreen() {
  const { inbox } = useFlow();
  const rows = useMemo(() => inbox.filter(m => m.type === "equity_ts"), [inbox]);
  return (
    <View style={{flex:1}}>
      <FlatList
        data={rows}
        keyExtractor={(it) => (it as any).id}
        renderItem={({ item }) => <FlowItem m={item} />}
      />
    </View>
  );
}
