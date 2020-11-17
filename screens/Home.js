import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import firebase from "../firebase/config";
import ScrollingBackground from "react-native-scrolling-images";

import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    Modal,
    Keyboard,
    Image,
    Dimensions,
} from "react-native";
import FlatButton from "../shared/flatButton";
import LoginForm from "./Login";
import RegisterForm from "./Register";
import { Audio } from "expo-av";

import { AdMobBanner } from "expo-ads-admob";
import { AsyncStorage } from "react-native";

export default function Home(props) {
    const [modalStatus, setModalStatus] = useState("closed");
    const [loggedInUser, setLoggedInUser] = useState(props.extraData.userData);
    const [currentHighscore, setCurrentHighscore] = useState(0);
    const [currentSpeedScore, setCurrentSpeedScore] = useState(0);
    const [currentTimeScore, setCurrentTimeScore] = useState(0);
    const gamesPlayed = useRef(0);
    const highscoresRef = useRef("empty");
    const speedScoresRef = useRef("empty");
    const timeScoresRef = useRef("empty");
    const currentHighscoreRank = useRef();
    const currentSpeedScoreRank = useRef();
    const currentTimeScoreRank = useRef();

    useLayoutEffect(() => {
        if (loggedInUser) {
            setCurrentHighscore(loggedInUser.highscore);
            setCurrentSpeedScore(loggedInUser.speedScore);
            setCurrentTimeScore(loggedInUser.timeScore);
            retrieveData("highscore");
            retrieveData("speedScore");
            retrieveData("timeScore");
            // storeData("highscore", loggedInUser.highscore.toString());
            // storeData("speedScore", loggedInUser.speedScore.toString());
            // storeData("timeScore", loggedInUser.timeScore.toString());
        } else {
            retrieveData("highscore");
            retrieveData("speedScore");
            retrieveData("timeScore");
            setTimeout(() => setModalStatus("reg"), 2000);
            console.log(currentHighscore, currentSpeedScore);
        }
    }, [loggedInUser]);

    const storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
            console.log(key, value, " stored");
        } catch (error) {
            console.log("error storing data");
        }
    };

    const retrieveData = async (key) => {
        let value = 0;
        try {
            value = await AsyncStorage.getItem(key);
            if (value !== null) {
                console.log(loggedInUser);
                if (loggedInUser) {
                    if (key == "highscore") {
                        console.log("highscore", value);
                        if (+value > loggedInUser.highscore) {
                            setCurrentHighscore(+value);
                            return firebase
                                .firestore()
                                .collection("users")
                                .doc(loggedInUser.id)
                                .update({
                                    highscore: +value,
                                })
                                .then(function () {
                                    console.log(
                                        "Document successfully updated!"
                                    );
                                    storeData("highscore", "0");
                                })
                                .catch(function (error) {
                                    console.error(
                                        "Error updating document: ",
                                        error
                                    );
                                });
                        }
                    } else if (key == "speedScore") {
                        console.log("speedScore", value);
                        if (+value > loggedInUser.speedScore) {
                            setCurrentSpeedScore(+value);

                            return firebase
                                .firestore()
                                .collection("users")
                                .doc(loggedInUser.id)
                                .update({
                                    speedScore: +value,
                                })
                                .then(function () {
                                    console.log(
                                        "Document successfully updated!"
                                    );
                                    storeData("speedScore", "0");
                                })
                                .catch(function (error) {
                                    console.error(
                                        "Error updating document: ",
                                        error
                                    );
                                });
                        }
                    } else if (key == "timeScore") {
                        console.log("timeScore", value);
                        if (+value > loggedInUser.timeScore) {
                            setCurrentTimeScore(+value);

                            return firebase
                                .firestore()
                                .collection("users")
                                .doc(loggedInUser.id)
                                .update({
                                    timeScore: +value,
                                })
                                .then(function () {
                                    console.log(
                                        "Document successfully updated!"
                                    );
                                    storeData("timeScore", "0");
                                })
                                .catch(function (error) {
                                    console.error(
                                        "Error updating document: ",
                                        error
                                    );
                                });
                        }
                    }
                } else {
                    if (key == "highscore") {
                        console.log("highscore", value);
                        setCurrentHighscore(+value);
                    } else if (key == "speedScore") {
                        console.log("speedScore", +value);
                        setCurrentSpeedScore(+value);
                    } else if (key == "timeScore") {
                        console.log("timeScore", value);
                        setCurrentTimeScore(+value);
                    }
                }
            } else {
                console.log(key, " empty");
            }
        } catch (error) {
            console.log("error retreiving data");
        }
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

    const increaseGamesPlayed = () => {
        gamesPlayed.current = gamesPlayed.current + 1;
    };

    const getGamesPlayed = () => {
        return gamesPlayed.current;
    };

    const handleLeaderBoardPress = () => {
        soundPress();

        props.navigation.navigate("LeaderBoard", {
            loggedInUser: loggedInUser,
            getHighscoresRef: getHighscoresRef,
            getSpeedScoresRef: getSpeedScoresRef,
            getTimeScoresRef: getTimeScoresRef,
            setHighscoresRef: setHighscoresRef,
            setSpeedScoresRef: setSpeedScoresRef,
            setTimeScoresRef: setTimeScoresRef,
            getCurrentHighscoreRank: getCurrentHighscoreRank,
            getCurrentSpeedScoreRank: getCurrentSpeedScoreRank,
            getCurrentTimeScoreRank: getCurrentTimeScoreRank,
            setCurrentHighscoreRank: setCurrentHighscoreRank,
            setCurrentSpeedScoreRank: setCurrentSpeedScoreRank,
            setCurrentTimeScoreRank: setCurrentTimeScoreRank,
        });
    };

    const setHighscoresRef = (highscores) => {
        highscoresRef.current = highscores;
    };
    const setSpeedScoresRef = (highscores) => {
        speedScoresRef.current = highscores;
    };
    const setTimeScoresRef = (highscores) => {
        timeScoresRef.current = highscores;
    };

    const getHighscoresRef = () => {
        return highscoresRef.current;
    };
    const getSpeedScoresRef = () => {
        return speedScoresRef.current;
    };
    const getTimeScoresRef = () => {
        return timeScoresRef.current;
    };

    const setCurrentHighscoreRank = (rank) => {
        currentHighscoreRank.current = rank;
    };
    const setCurrentSpeedScoreRank = (rank) => {
        currentSpeedScoreRank.current = rank;
    };
    const setCurrentTimeScoreRank = (rank) => {
        currentTimeScoreRank.current = rank;
    };

    const getCurrentHighscoreRank = () => {
        return currentHighscoreRank.current;
    };
    const getCurrentSpeedScoreRank = () => {
        return currentSpeedScoreRank.current;
    };
    const getCurrentTimeScoreRank = () => {
        return currentTimeScoreRank.current;
    };

    const handleSandboxPress = () => {
        props.navigation.navigate("Sandbox");
    };

    const handleLogoutPress = () => {
        soundPress();

        firebase
            .auth()
            .signOut()
            .then(() => {
                console.log("user logged out:");
            });
        setLoggedInUser(null);
        setCurrentHighscore(0);
        setCurrentSpeedScore(0);
        setCurrentTimeScore(0);
        setCurrentHighscoreRank();
        setCurrentSpeedScoreRank();
        setCurrentTimeScoreRank();
        gamesPlayed.current = 0;
        highscoresRef.current = "empty";
        speedScoresRef.current = "empty";
        timeScoresRef.current = "empty";
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
        // pressSound.current.playAsync();
        soundPress();
        props.navigation.navigate("HowToPlay");
    };

    const handleGameModesPress = () => {
        soundPress();

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
                getGamesPlayed: getGamesPlayed,
                increaseGamesPlayed: increaseGamesPlayed,
                setHighscoresRef: setHighscoresRef,
                setSpeedScoresRef: setSpeedScoresRef,
                setTimeScoresRef: setTimeScoresRef,
                getHighscoresRef: getHighscoresRef,
                getSpeedScoresRef: getSpeedScoresRef,
                getTimeScoresRef: getTimeScoresRef,
                getCurrentHighscoreRank: getCurrentHighscoreRank,
                getCurrentSpeedScoreRank: getCurrentSpeedScoreRank,
                getCurrentTimeScoreRank: getCurrentTimeScoreRank,
                setCurrentHighscoreRank: setCurrentHighscoreRank,
                setCurrentSpeedScoreRank: setCurrentSpeedScoreRank,
                setCurrentTimeScoreRank: setCurrentTimeScoreRank,
                storeData: storeData,
            });
        } else {
            console.log(currentHighscore, currentSpeedScore);
            props.navigation.navigate("GameModes", {
                loggedInUser: null,
                currentHighscore: currentHighscore,
                currentSpeedScore: currentSpeedScore,
                currentTimeScore: currentTimeScore,
                setCurrentHighscore: setCurrentHighscore,
                setCurrentSpeedScore: setCurrentSpeedScore,
                setCurrentTimeScore: setCurrentTimeScore,
                mainDeck: props.extraData.mainDeck,
                getGamesPlayed: getGamesPlayed,
                increaseGamesPlayed: increaseGamesPlayed,
                setHighscoresRef: setHighscoresRef,
                setSpeedScoresRef: setSpeedScoresRef,
                setTimeScoresRef: setTimeScoresRef,
                getHighscoresRef: getHighscoresRef,
                getSpeedScoresRef: getSpeedScoresRef,
                getTimeScoresRef: getTimeScoresRef,
                getCurrentHighscoreRank: getCurrentHighscoreRank,
                getCurrentSpeedScoreRank: getCurrentSpeedScoreRank,
                getCurrentTimeScoreRank: getCurrentTimeScoreRank,
                setCurrentHighscoreRank: setCurrentHighscoreRank,
                setCurrentSpeedScoreRank: setCurrentSpeedScoreRank,
                setCurrentTimeScoreRank: setCurrentTimeScoreRank,
                storeData: storeData,
            });
        }
    };

    const fancyTimeFormat = (duration) => {
        // Hours, minutes and seconds
        var hrs = ~~(duration / 3600);
        var mins = ~~((duration % 3600) / 60);
        var secs = ~~duration % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        var ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    };

    return (
        <View style={styles.container}>
            <ScrollingBackground
                style={styles.scrollingBackground}
                speed={10}
                direction={"left"}
                images={[require("../assets/images/doodle3c.jpg")]}
            />
            <Image
                source={require("../assets/images/bannerBlue.png")}
                style={styles.banner}
            />
            <Text style={styles.title}>Memory Press</Text>
            {loggedInUser ? (
                <View style={styles.usernameContainer}>
                    <Text style={styles.usernameText}>
                        {loggedInUser.username}
                    </Text>
                    <View style={styles.scoresContainer}>
                        <Text style={styles.bestText}>
                            Best Score:{" "}
                            <Text style={styles.scoreText}>
                                {currentHighscore}
                            </Text>
                        </Text>
                        <Text style={styles.bestText}>
                            Best Speed:{" "}
                            <Text style={styles.speedText}>
                                {currentSpeedScore}
                            </Text>
                        </Text>
                        <Text style={styles.bestText}>
                            Best Time:{" "}
                            <Text style={styles.timeText}>
                                {fancyTimeFormat(currentTimeScore)}
                            </Text>
                        </Text>
                    </View>
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
                    title={"Leader Board"}
                    withVideo={true}
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
            <AdMobBanner
                style={styles.ad}
                bannerSize={"smartBannerPortrait"}
                adUnitID="ca-app-pub-3940256099942544/2934735716"
                onDidFailToReceiveAdWithError={() => console.log("ad error")}
            />

            {/* <FlatButton title="Sandbox" onPress={handleSandboxPress} /> */}

            <Modal visible={modalStatus == "reg"} animationType="slide">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Create Account</Text>

                        <RegisterForm
                            closeModal={() => setModalStatus("closed")}
                            switchModal={() => setModalStatus("login")}
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
                            switchModal={() => setModalStatus("reg")}
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
    ad: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
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
        paddingHorizontal: 40,
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
    scoresContainer: {
        width: "100%",
        alignItems: "flex-start",
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
        top: 280,
    },
    buttonsLoggedInContainer: {
        position: "absolute",
        top: 350,
    },
});
