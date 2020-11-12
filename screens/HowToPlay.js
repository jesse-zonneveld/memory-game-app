import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import FlatButton from "../shared/flatButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import banner from "../assets/images/bannerBlue.png";

export default function HowToPlay(props) {
    const handleBackToMenuPress = () => {
        props.navigation.navigate("Home");
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
            <Text style={styles.title}>How to Play</Text>
            <View style={styles.instructionsContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        <Text style={styles.scoreText}>Score points</Text> by
                        pressing on cards that you have not yet pressed.
                    </Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        <Text style={styles.goalText}>The goal</Text> is to
                        complete the entire deck by only pressing on each card
                        once.
                    </Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
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
        shadowOpacity: 0.3,
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
    instructionsContainer: {
        flex: 1,
    },
    textContainer: {
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
