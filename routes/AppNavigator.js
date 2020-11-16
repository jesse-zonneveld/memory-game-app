import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import Game from "../screens/Game";
import LeaderBoard from "../screens/LeaderBoard";
import Sandbox from "../screens/Sandbox";
import HowToPlay from "../screens/HowToPlay";
import GameModes from "../screens/GameModes";
import TimeGame from "../screens/TimeGame";

const { Navigator, Screen } = createStackNavigator();

const HomeNavigator = (mainProps) => (
    <Navigator headerMode="none">
        <Screen name="Home">
            {(props) => (
                <Home
                    {...props}
                    extraData={{
                        userData: mainProps.userData,
                        mainDeck: mainProps.mainDeck,
                    }}
                />
            )}
        </Screen>
        <Screen name="Game" component={Game} />
        <Screen name="TimeGame" component={TimeGame} />
        <Screen name="LeaderBoard" component={LeaderBoard} />
        <Screen name="Sandbox" component={Sandbox} />
        <Screen name="HowToPlay" component={HowToPlay} />
        <Screen name="GameModes" component={GameModes} />
    </Navigator>
);

export const AppNavigator = (props) => (
    <NavigationContainer>
        <HomeNavigator userData={props.userData} mainDeck={props.mainDeck} />
    </NavigationContainer>
);
