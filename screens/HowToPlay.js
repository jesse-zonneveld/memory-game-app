import React, { useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Audio } from "expo-av";
import { Dimensions } from "react-native";

export default function HowToPlay(props) {
    const isSmallDevice = useRef(Dimensions.get("window").width < 350);

    const handleBackToMenuPress = () => {
        soundPress();
        props.navigation.navigate("Home");
    };

    const soundPress = async () => {
        try {
            const {
                sound: soundObject,
                status,
            } = await Audio.Sound.createAsync(
                require("../assets/sounds/ding.wav"),
                { shouldPlay: true }
            );
            await soundObject.playAsync();
        } catch (error) {
            console.log(error);
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
            <Image
                source={require("../assets/images/bannerBlue.png")}
                style={
                    isSmallDevice.current ? styles.smallBanner : styles.banner
                }
            />
            <Text
                style={isSmallDevice.current ? styles.smallTitle : styles.title}
            >
                How to Play
            </Text>
            <View style={styles.instructionsContainer}>
                <View style={styles.textContainer}>
                    <Text
                        style={
                            isSmallDevice.current
                                ? styles.smallText
                                : styles.text
                        }
                    >
                        <Text style={styles.scoreText}>Score points</Text> by
                        pressing on cards that you have not yet pressed.
                    </Text>
                </View>
                <View style={styles.textContainer}>
                    <Text
                        style={
                            isSmallDevice.current
                                ? styles.smallText
                                : styles.text
                        }
                    >
                        <Text style={styles.goalText}>The goal</Text> is to
                        complete the entire deck by only pressing on each card
                        once.
                    </Text>
                </View>
                <View style={styles.textContainer}>
                    <Text
                        style={
                            isSmallDevice.current
                                ? styles.smallText
                                : styles.text
                        }
                    >
                        <Text style={styles.loseText}>You lose</Text> if you
                        press on a card that you have previously pressed on or
                        if the timer reaches zero.
                    </Text>
                </View>
            </View>

            {/* <FlatButton title="Back to Menu" onPress={handleBackToMenuPress} /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 200,
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
        paddingLeft: 10,
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
        maxWidth: 500,
        height: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,

        // elevation: 5,
    },
    smallBanner: {
        position: "absolute",
        top: 60,
        width: "110%",
        maxWidth: 500,
        height: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        transform: [{ scale: 0.9 }],
    },
    title: {
        fontFamily: "nunito-bold",
        fontSize: 32,
        // marginBottom: 100,
        position: "absolute",
        top: 120,
    },
    smallTitle: {
        fontFamily: "nunito-bold",
        fontSize: 28,
        // marginBottom: 100,
        position: "absolute",
        top: 100,
    },
    instructionsContainer: {
        flex: 1,
    },
    textContainer: {
        borderRadius: 10,
        marginBottom: 20,
        width: 320,
        backgroundColor: "#ddd",
        // borderColor: "black",
        // borderWidth: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,

        elevation: 5,
    },
    text: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        fontSize: 20,
        fontFamily: "nunito-regular",
    },
    smallText: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        fontSize: 15,
        fontFamily: "nunito-regular",
    },
    scoreText: {
        fontFamily: "nunito-bold",
        color: "#1E72F1",
    },
    goalText: {
        fontFamily: "nunito-bold",
        color: "#E31EF1",
    },
    loseText: {
        fontFamily: "nunito-bold",
        color: "#F1561E",
    },
});
