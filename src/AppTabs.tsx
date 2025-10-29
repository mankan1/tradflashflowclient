// AppTabs.tsx
import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import OptionsTSScreen from "./screens/OptionsTSScreen";
import EquityTSScreen from "./screens/EquityTSScreen";
import SweepsScreen from "./screens/SweepsScreen";
import BlocksScreen from "./screens/BlocksScreen";
import ChainsScreen from "./screens/ChainsScreen";

// ✅ named export
import { WatchlistProvider } from "./context/WatchlistContext";
// ✅ the UI to manage symbols
import WatchlistManager from "./components/WatchlistManager";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  const [inbox, setInbox] = useState<any[]>([]);
  // keep your socket if you need it here
  // useFlowSocket((m) => setInbox(prev => [m, ...prev].slice(0, 400)));

  return (
    // ✅ Wrap the navigator with the provider
    <WatchlistProvider>
      <Tab.Navigator screenOptions={{ headerTitle: "TradeFlash" }}>
        <Tab.Screen name="Options T&S" component={OptionsTSScreen} />
        <Tab.Screen name="Equity T&S" component={EquityTSScreen} />
        <Tab.Screen name="Sweeps" component={SweepsScreen} />
        <Tab.Screen name="Blocks" component={BlocksScreen} />
        <Tab.Screen name="Chains" component={ChainsScreen} />
        {/* ✅ Render a real component as a screen */}
        <Tab.Screen name="Watchlist" component={WatchlistManager} />
      </Tab.Navigator>
    </WatchlistProvider>
  );
}

