import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import Game from "../screens/Game";
import LeaderBoard from "../screens/leaderBoard";
import Sandbox from "../screens/Sandbox";

const { Navigator, Screen } = createStackNavigator();

const HomeNavigator = () => (
    <Navigator headerMode="none">
        <Screen name="Home" component={Home} />
        <Screen name="Game" component={Game} />
        <Screen name="LeaderBoard" component={LeaderBoard} />
        <Screen name="Sandbox" component={Sandbox} />
    </Navigator>
);

export const AppNavigator = () => (
    <NavigationContainer>
        <HomeNavigator />
    </NavigationContainer>
);
