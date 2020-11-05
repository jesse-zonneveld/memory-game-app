import React from "react";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";
import { AppNavigator } from "./routes/AppNavigator";

export default function App() {
    let [fontsLoaded] = useFonts({
        "nunito-regular": require("./assets/fonts/Nunito-Regular.ttf"),
        "nunito-bold": require("./assets/fonts/Nunito-Bold.ttf"),
        "nunito-light": require("./assets/fonts/Nunito-Light.ttf"),
    });

    if (fontsLoaded) {
        return <AppNavigator />;
    } else {
        return <AppLoading />;
    }
}
