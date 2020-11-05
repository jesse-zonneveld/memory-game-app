import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FlatButton from "../shared/flatButton";

export default function Home(props) {
    const mainDeck = [];

    (function initializeMainDeck() {
        for (let i = 0; i < 100; i++) {
            mainDeck.push({
                key: i,
                icon: "a",
            });
        }
    })();

    const handleStartGamePress = (time, deckSize, sampleDeckSize) => {
        props.navigation.navigate("Game", {
            time,
            deckSize,
            sampleDeckSize,
            mainDeck: mainDeck,
        });
    };

    const handleLeaderBoardPress = () => {
        props.navigation.navigate("LeaderBoard");
    };

    const handleSandboxPress = () => {
        props.navigation.navigate("Sandbox");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Memory Press</Text>
            <FlatButton
                title="Normal Game"
                onPress={() => handleStartGamePress(10, 20, 9)}
            />
            <FlatButton
                title="Speed Game"
                onPress={() => handleStartGamePress(5, 10, 3)}
            />
            <FlatButton
                title="Endless Game"
                onPress={() => handleStartGamePress(10, 100, 9)}
            />
            <FlatButton title="Leader Board" onPress={handleLeaderBoardPress} />
            <FlatButton title="Sandbox" onPress={handleSandboxPress} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 100,
    },
    title: {
        fontFamily: "nunito-bold",
        fontSize: 40,
        marginBottom: 100,
    },
});
