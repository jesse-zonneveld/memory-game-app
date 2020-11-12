import React, { useRef, useState, useLayoutEffect } from "react";
import firebase from "../firebase/config";
import ScrollingBackground from "react-native-scrolling-images";
import { Dimensions } from "react-native";
import bgImg from "../assets/images/doodle3c.jpg";
import banner from "../assets/images/bannerBlue.png";
import { AppLoading } from "expo";

import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    Modal,
    Keyboard,
    Image,
} from "react-native";
import FlatButton from "../shared/flatButton";
import LoginForm from "./Login";
import RegisterForm from "./Register";

export default function Home(props) {
    console.log(props.extraData.mainDeck);
    const [modalStatus, setModalStatus] = useState("closed");
    const [loggedInUser, setLoggedInUser] = useState(props.extraData.userData);
    const [currentHighscore, setCurrentHighscore] = useState(0);
    const [currentSpeedScore, setCurrentSpeedScore] = useState(0);
    const [currentTimeScore, setCurrentTimeScore] = useState(0);

    useLayoutEffect(() => {
        if (loggedInUser) {
            setCurrentHighscore(loggedInUser.highscore);
            setCurrentSpeedScore(loggedInUser.speedScore);
            setCurrentTimeScore(loggedInUser.timeScore);
        }
    }, [loggedInUser]);
    // const mainDeck = [];

    // (function initializeMainDeck() {
    //     for (let i = 0; i < 100; i++) {
    //         mainDeck.push({
    //             key: i,
    //             icon: "a",
    //         });
    //     }
    // })();

    // const updateCurrentHighscore = (score) => {
    //     currentHighscore.current = score;
    // };

    // const handleStartGamePress = (time, deckSize, sampleDeckSize) => {
    //     if (loggedInUser) {
    //         props.navigation.navigate("Game", {
    //             loggedInUser: loggedInUser,
    //             highscore: currentHighscore,
    //             setCurrentHighscore: setCurrentHighscore,
    //             time,
    //             deckSize,
    //             sampleDeckSize,
    //             mainDeck: props.extraData.mainDeck,
    //         });
    //     } else {
    //         props.navigation.navigate("Game", {
    //             loggedInUser: null,
    //             highscore: 0,
    //             time,
    //             deckSize,
    //             sampleDeckSize,
    //             mainDeck: props.extraData.mainDeck,
    //         });
    //     }
    // };

    const handleLeaderBoardPress = () => {
        props.navigation.navigate("LeaderBoard", {
            loggedInUser: loggedInUser,
        });
    };

    const handleSandboxPress = () => {
        props.navigation.navigate("Sandbox");
    };

    const handleLogoutPress = () => {
        firebase
            .auth()
            .signOut()
            .then(() => {
                console.log("user logged out:");
            });
        setLoggedInUser(null);
    };

    // const handleAddHighScorePress = () => {
    //     return firebase
    //         .firestore()
    //         .collection("users")
    //         .doc(loggedInUser.id)
    //         .update({
    //             highscore: 1000,
    //         })
    //         .then(function () {
    //             console.log("Document successfully updated!");
    //         })
    //         .catch(function (error) {
    //             console.error("Error updating document: ", error);
    //         });
    // };

    const handleHowToPlayPress = () => {
        props.navigation.navigate("HowToPlay");
    };

    const handleGameModesPress = () => {
        if (loggedInUser) {
            props.navigation.navigate("GameModes", {
                loggedInUser: loggedInUser,
                currentHighscore: currentHighscore,
                currentSpeedScore: currentSpeedScore,
                currentTimeScore: currentTimeScore,
                setCurrentHighscore: setCurrentHighscore,
                setCurrentSpeedScore: setCurrentSpeedScore,
                setCurrentTimeScore: setCurrentTimeScore,
                mainDeck: props.extraData.mainDeck,
            });
        } else {
            props.navigation.navigate("GameModes", {
                loggedInUser: null,
                currenHighscore: 0,
                mainDeck: props.extraData.mainDeck,
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
            <Image source={banner} style={styles.banner} />
            <Text style={styles.title}>Memory Press</Text>
            {loggedInUser ? (
                <View style={styles.usernameContainer}>
                    <Text style={styles.usernameText}>
                        {loggedInUser.username}
                    </Text>
                    <Text style={styles.bestText}>
                        Best Score:{" "}
                        <Text style={styles.scoreText}>{currentHighscore}</Text>
                    </Text>
                    <Text style={styles.bestText}>
                        Best Speed:{" "}
                        <Text style={styles.speedText}>
                            {currentSpeedScore}
                        </Text>
                    </Text>
                    <Text style={styles.bestText}>
                        Best Time:{" "}
                        <Text style={styles.timeText}>{currentTimeScore}</Text>
                    </Text>
                </View>
            ) : (
                <Text></Text>
            )}
            <View
                style={
                    loggedInUser
                        ? styles.buttonsLoggedInContainer
                        : styles.buttonsLoggedOutContainer
                }
            >
                <FlatButton title="Game Modes" onPress={handleGameModesPress} />
                {/* <FlatButton
                    title="Speed Game"
                    onPress={() => handleStartGamePress(5, 10, 3)}
                />
                <FlatButton
                    title="Endless Game"
                    onPress={() => handleStartGamePress(10, 100, 9)}
                /> */}
                {/* <FlatButton
                    title="add highscore"
                    onPress={handleAddHighScorePress}
                /> */}
                <FlatButton
                    title="How to Play"
                    onPress={handleHowToPlayPress}
                />
                <FlatButton
                    title="Leader Board"
                    onPress={handleLeaderBoardPress}
                />
                {loggedInUser ? (
                    <FlatButton title="Logout" onPress={handleLogoutPress} />
                ) : (
                    <View>
                        <FlatButton
                            title="Register Account"
                            onPress={() => setModalStatus("reg")}
                        />
                        <FlatButton
                            title="Login"
                            onPress={() => setModalStatus("login")}
                        />
                    </View>
                )}
            </View>

            {/* <FlatButton title="Sandbox" onPress={handleSandboxPress} /> */}

            <Modal visible={modalStatus == "reg"} animationType="slide">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Create Account</Text>

                        <RegisterForm
                            closeModal={() => setModalStatus("closed")}
                            setLoggedInUser={(user) => setLoggedInUser(user)}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            <Modal visible={modalStatus == "login"} animationType="slide">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Welcome Back!</Text>
                        <LoginForm
                            closeModal={() => setModalStatus("closed")}
                            setLoggedInUser={(user) => setLoggedInUser(user)}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
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
    modalContainer: {
        flex: 1,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 30,
        position: "absolute",
        top: 100,
        fontWeight: "bold",
    },
    banner: {
        position: "absolute",
        top: 65,
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
        top: 105,
    },
    scrollingBackground: {
        backgroundColor: "#fff",
    },
    usernameContainer: {
        borderWidth: 2,
        borderColor: "black",
        position: "absolute",
        top: 180,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "rgba(255,255,255,0.8)",
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,

        elevation: 5,
    },
    usernameText: {
        fontSize: 25,
        fontFamily: "nunito-bold",
        textAlign: "center",
    },
    bestText: {
        fontFamily: "nunito-regular",
        fontSize: 20,
        textAlign: "center",
    },
    scoreText: {
        fontFamily: "nunito-bold",
        fontSize: 20,
        color: "#1E72F1",
    },
    speedText: {
        fontFamily: "nunito-bold",
        fontSize: 20,
        color: "#1E72F1",
    },
    timeText: {
        fontFamily: "nunito-bold",
        fontSize: 20,
        color: "#1E72F1",
    },
    buttonsLoggedOutContainer: {
        position: "absolute",
        top: 300,
    },
    buttonsLoggedInContainer: {
        position: "absolute",
        top: 350,
    },
});
