import React, { useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
    Linking,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Audio } from "expo-av";
import { Dimensions } from "react-native";
import FlatButton from "../shared/flatButton";
import firebase from "../firebase/config";

export default function Settings(props) {
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

    const confirmDelete = () => {
        Alert.alert(
            "Are you sure you want to delete this account? You can not undo this action.",
            "",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: "Delete Account",
                    onPress: handleDeletePress,
                },
            ],
            { cancelable: false }
        );
    };

    const handleDeletePress = async () => {
        const user = await firebase.auth().currentUser;

        if (user) {
            await user.delete().then(
                function () {
                    console.log("user deleted");
                },
                function (error) {
                    console.log("error deleting user");
                }
            );
            props.route.params.handleLogoutPress();
            props.navigation.navigate("Home");
        } else {
            soundPress();
            Alert.alert(
                "Oops! No account logged in",
                "",
                [
                    {
                        text: "Back to Menu",
                        onPress: () => props.navigation.navigate("Home"),
                        style: "cancel",
                    },
                ],
                { cancelable: false }
            );
        }
    };

    const handlePrivacyPress = () => {
        Linking.openURL(
            "https://jesse-zonneveld.github.io/memory-press-privacy-policy/privacy-policy.html"
        );
    };
    const handleTermsPress = () => {
        Linking.openURL(
            "https://jesse-zonneveld.github.io/memory-press-privacy-policy/terms-and-conditions.html"
        );
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
                Settings
            </Text>
            <View style={styles.buttonsContainer}>
                <FlatButton title="Delete Account" onPress={confirmDelete} />
                <FlatButton
                    title="Privacy Policy"
                    onPress={handlePrivacyPress}
                />
                <FlatButton
                    title="Terms and Conditions"
                    onPress={handleTermsPress}
                />
            </View>
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
