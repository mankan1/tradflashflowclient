import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppTabs from "./src/AppTabs";
import { FlowProvider } from "./src/flow/FlowProvider";

export default function App() {
  return (
    <FlowProvider>
      <NavigationContainer>
        <AppTabs />
      </NavigationContainer>
    </FlowProvider>
  );
}
