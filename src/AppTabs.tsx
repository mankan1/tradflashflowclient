import React from "react";
import { useState } from "react";
import { useFlowSocket } from "./hooks/useFlowSocket";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import OptionsTSScreen from "./screens/OptionsTSScreen";
import EquityTSScreen from "./screens/EquityTSScreen";
import SweepsScreen from "./screens/SweepsScreen";
import BlocksScreen from "./screens/BlocksScreen";
import ChainsScreen from "./screens/ChainsScreen";

const Tab = createBottomTabNavigator();

export default function AppTabs() {

  const [inbox, setInbox] = useState<any[]>([]);
  useFlowSocket((m) => setInbox(prev => [m, ...prev].slice(0, 400)));
  return (
    <Tab.Navigator screenOptions={{ headerTitle: "TradeFlash" }}>
      <Tab.Screen name="Options T&S" component={OptionsTSScreen} />
      <Tab.Screen name="Equity T&S" component={EquityTSScreen} />
      <Tab.Screen name="Sweeps" component={SweepsScreen} />
      <Tab.Screen name="Blocks" component={BlocksScreen} />
      <Tab.Screen name="Chains" component={ChainsScreen} />
    </Tab.Navigator>
  );
}

