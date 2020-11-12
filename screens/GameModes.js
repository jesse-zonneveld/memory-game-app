import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import FlatButton from "../shared/flatButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import banner from "../assets/images/bannerBlue.png";

export default function GameModes(props) {
    const handleBackToMenuPress = () => {
        props.navigation.navigate("Home");
    };

    const handleNormalGamePress = (time, deckSize, sampleDeckSize) => {
        if (props.route.params.loggedInUser) {
            props.navigation.navigate("Game", {
                loggedInUser: props.route.params.loggedInUser,
                highscore: props.route.params.currentHighscore,
                setCurrentHighscore: props.route.params.setCurrentHighscore,
                time,
                deckSize,
                sampleDeckSize,
                mainDeck: props.route.params.mainDeck,
            });
        } else {
            props.navigation.navigate("Game", {
                loggedInUser: null,
                highscore: 0,
                time,
                deckSize,
                sampleDeckSize,
                mainDeck: props.route.params.mainDeck,
            });
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackToMenuPress}
            >
                <FontAwesomeIcon icon={faChevronLeft} size={24} />
                <Text style={styles.backText}>Menu</Text>
            </TouchableOpacity>
            <Image source={banner} style={styles.banner} />
            <Text style={styles.title}>Game Modes</Text>
            <FlatButton
                title="Normal"
                onPress={() => handleNormalGamePress(15, 100, 9)}
            />
            <FlatButton
                title="Speed Round"
                onPress={() => handleNormalGamePress(5, 100, 3)}
            />
            <FlatButton
                title="Timed 30"
                onPress={() => handleStartGamePress(15, 100, 9)}
            />
            <FlatButton
                title="Timed 40"
                onPress={() => handleStartGamePress(15, 100, 9)}
            />
            <FlatButton
                title="Timed 50"
                onPress={() => handleStartGamePress(15, 100, 9)}
            />
            <FlatButton
                title="Timed 100"
                onPress={() => handleStartGamePress(15, 100, 9)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 250,
        flex: 1,
        alignItems: "center",
        backgroundColor: "#FCFEEF",
    },
    backButton: {
        flexDirection: "row",
        position: "absolute",
        left: 0,
        top: 20,
        padding: 20,
        zIndex: 5,
    },
    backText: {
        fontSize: 20,
        marginLeft: 5,
        fontFamily: "nunito-regular",
    },
    banner: {
        position: "absolute",
        top: 95,
        width: "100%",
        height: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,

        // elevation: 5,
    },
    title: {
        fontFamily: "nunito-bold",
        fontSize: 32,
        // marginBottom: 100,
        position: "absolute",
        top: 135,
    },
});
