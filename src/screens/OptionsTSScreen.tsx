import React from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { useFlow } from "../flow/FlowProvider";
import FlowItem from "../components/FlowItem";

export default function OptionsTSScreen() {
  const { items, refresh, ready } = useFlow("options_ts");
  return (
    <View style={{ flex:1 }}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => <FlowItem m={item} />}
        refreshControl={<RefreshControl refreshing={!ready} onRefresh={() => refresh("options_ts")} />}
      />
    </View>
  );
}

