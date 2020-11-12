import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import FlatButtonBig from "../shared/flatButtonBig";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import banner from "../assets/images/bannerBlue.png";
import ScrollingBackground from "react-native-scrolling-images";
import bgImg from "../assets/images/doodle3c.jpg";

export default function GameModes(props) {
    const handleBackToMenuPress = () => {
        props.navigation.navigate("Home");
    };

    const handleNormalGamePress = (
        gameMode,
        time,
        deckSize,
        sampleDeckSize
    ) => {
        if (props.route.params.loggedInUser) {
            props.navigation.navigate("Game", {
                loggedInUser: props.route.params.loggedInUser,
                highscore: props.route.params.currentHighscore,
                setCurrentHighscore: props.route.params.setCurrentHighscore,
                gameMode,
                time,
                deckSize,
                sampleDeckSize,
                mainDeck: props.route.params.mainDeck,
            });
        } else {
            props.navigation.navigate("Game", {
                loggedInUser: null,
                highscore: 0,
                gameMode,
                time,
                deckSize,
                sampleDeckSize,
                mainDeck: props.route.params.mainDeck,
            });
        }
    };

    const handleSpeedGamePress = (gameMode, time, deckSize, sampleDeckSize) => {
        if (props.route.params.loggedInUser) {
            props.navigation.navigate("Game", {
                loggedInUser: props.route.params.loggedInUser,
                highscore: props.route.params.currentSpeedScore,
                setCurrentHighscore: props.route.params.setCurrentSpeedScore,
                gameMode,
                time,
                deckSize,
                sampleDeckSize,
                mainDeck: props.route.params.mainDeck,
            });
        } else {
            props.navigation.navigate("Game", {
                loggedInUser: null,
                highscore: 0,
                gameMode,
                time,
                deckSize,
                sampleDeckSize,
                mainDeck: props.route.params.mainDeck,
            });
        }
    };

    return (
        <View style={styles.container}>
            <ScrollingBackground
                style={styles.scrollingBackground}
                speed={10}
                direction={"left"}
                images={[bgImg]}
            />
            <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackToMenuPress}
            >
                <FontAwesomeIcon icon={faChevronLeft} size={24} />
                <Text style={styles.backText}>Menu</Text>
            </TouchableOpacity>
            <Image source={banner} style={styles.banner} />
            <Text style={styles.title}>Game Modes</Text>
            <View style={styles.buttonsContainer}>
                <FlatButtonBig
                    title="Normal"
                    onPress={() => handleNormalGamePress("normal", 15, 100, 9)}
                    color={"#f01d71"}
                />
                <FlatButtonBig
                    title="Speed Round"
                    onPress={() => handleSpeedGamePress("speed", 5, 100, 3)}
                    color={"#1E72F1"}
                />
                <FlatButtonBig
                    title="Timed 50"
                    onPress={() => handleStartGamePress("timed", 15, 100, 9)}
                    color={"#E31EF1"}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    scrollingBackground: {
        backgroundColor: "#fff",
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
        top: 80,
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
        top: 120,
    },
    buttonsContainer: {
        position: "absolute",
        top: 300,
    },
});
