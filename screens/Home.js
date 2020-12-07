import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import firebase from "../firebase/config";
import ScrollingBackground from "react-native-scrolling-images";
import { StatusBar } from "expo-status-bar";

import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    Modal,
    Keyboard,
    Image,
    TouchableOpacity,
    Alert,
} from "react-native";
import FlatButton from "../shared/flatButton";
import SmallFlatButton from "../shared/smallFlatButton";
import { Dimensions } from "react-native";

import LoginForm from "./Login";
import RegisterForm from "./Register";
import { Audio } from "expo-av";

import { AdMobBanner } from "expo-ads-admob";
import { AsyncStorage } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { faSlash } from "@fortawesome/free-solid-svg-icons";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import * as Network from "expo-network";

export default function Home(props) {
    const [modalStatus, setModalStatus] = useState("closed");
    const [loggedInUser, setLoggedInUser] = useState(props.extraData.userData);
    const [currentNormalScore, setCurrentNormalScore] = useState(0);
    const [currentSpeedScore, setCurrentSpeedScore] = useState(0);
    const [currentTimeScore, setCurrentTimeScore] = useState(0);
    const gamesPlayed = useRef(0);
    const normalScoresRef = useRef("empty");
    const speedScoresRef = useRef("empty");
    const timeScoresRef = useRef("empty");
    const currentNormalScoreRank = useRef();
    const currentSpeedScoreRank = useRef();
    const currentTimeScoreRank = useRef();
    const music = useRef();
    const musicStatusRef = useRef("noSound");
    const [musicStatus, setMusicStatus] = useState("noSound");
    const isSmallDevice = useRef(Dimensions.get("window").width < 350);

    useEffect(() => {
        playRecording();
    }, []);

    useLayoutEffect(() => {
        const checkUser = async () => {
            if (loggedInUser) {
                setCurrentNormalScore(loggedInUser.highscore);
                setCurrentSpeedScore(loggedInUser.speedScore);
                setCurrentTimeScore(loggedInUser.timeScore);
                retrieveData("normalScore");
                retrieveData("speedScore");
                retrieveData("timeScore");
            } else {
                retrieveData("normalScore");
                retrieveData("speedScore");
                retrieveData("timeScore");
                if ((await Network.getNetworkStateAsync()).isConnected) {
                    setTimeout(() => setModalStatus("reg"), 1500);
                }
            }
        };
        checkUser();
    }, [loggedInUser]);

    const storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log("error storing data");
        }
    };

    const retrieveData = async (key) => {
        let value = 0;
        try {
            value = await AsyncStorage.getItem(key);
            if (value !== null) {
                if (loggedInUser) {
                    if (key == "normalScore") {
                        if (+value > loggedInUser.highscore) {
                            setCurrentNormalScore(+value);
                            await firebase
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
                                    storeData("normalScore", "0");
                                })
                                .catch(function (error) {
                                    console.error(
                                        "Error updating document: ",
                                        error
                                    );
                                });

                            let normalScoresFB = [];
                            await firebase
                                .firestore()
                                .collection("highscores")
                                .doc("normal")
                                .get()
                                .then(function (doc) {
                                    if (doc.exists) {
                                        normalScoresFB = Object.entries(
                                            doc.data()
                                        );
                                    } else {
                                        console.log("No such document!");
                                    }
                                })
                                .catch(function (error) {
                                    console.log(
                                        "Error getting document:",
                                        error
                                    );
                                });

                            if (normalScoresFB.length < 200) {
                                await firebase
                                    .firestore()
                                    .collection("highscores")
                                    .doc("normal")
                                    .update({
                                        [loggedInUser.username]: +value,
                                    });
                            } else {
                                const lowestUsernameAndScore = normalScoresFB.sort(
                                    (a, b) => a[1] - b[1]
                                )[0];

                                if (+value > lowestUsernameAndScore[1]) {
                                    await firebase
                                        .firestore()
                                        .collection("highscores")
                                        .doc("normal")
                                        .update({
                                            [lowestUsernameAndScore[0]]: firebase.firestore.FieldValue.delete(),
                                            [loggedInUser.username]: +value,
                                        });
                                }
                            }
                        }
                    } else if (key == "speedScore") {
                        if (+value > loggedInUser.speedScore) {
                            setCurrentSpeedScore(+value);

                            await firebase
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

                            let speedScoresFB = [];
                            await firebase
                                .firestore()
                                .collection("highscores")
                                .doc("speed")
                                .get()
                                .then(function (doc) {
                                    if (doc.exists) {
                                        speedScoresFB = Object.entries(
                                            doc.data()
                                        );
                                    } else {
                                        console.log("No such document!");
                                    }
                                })
                                .catch(function (error) {
                                    console.log(
                                        "Error getting document:",
                                        error
                                    );
                                });

                            if (speedScoresFB.length < 200) {
                                await firebase
                                    .firestore()
                                    .collection("highscores")
                                    .doc("speed")
                                    .update({
                                        [loggedInUser.username]: +value,
                                    });
                            } else {
                                const lowestUsernameAndScore = speedScoresFB.sort(
                                    (a, b) => a[1] - b[1]
                                )[0];

                                if (+value > lowestUsernameAndScore[1]) {
                                    await firebase
                                        .firestore()
                                        .collection("highscores")
                                        .doc("speed")
                                        .update({
                                            [lowestUsernameAndScore[0]]: firebase.firestore.FieldValue.delete(),
                                            [loggedInUser.username]: +value,
                                        });
                                }
                            }
                        }
                    } else if (key == "timeScore") {
                        if (+value > loggedInUser.timeScore) {
                            setCurrentTimeScore(+value);

                            await firebase
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

                            let timeScoresFB = [];
                            await firebase
                                .firestore()
                                .collection("highscores")
                                .doc("time")
                                .get()
                                .then(function (doc) {
                                    if (doc.exists) {
                                        timeScoresFB = Object.entries(
                                            doc.data()
                                        );
                                    } else {
                                        console.log("No such document!");
                                    }
                                })
                                .catch(function (error) {
                                    console.log(
                                        "Error getting document:",
                                        error
                                    );
                                });

                            if (timeScoresFB.length < 200) {
                                await firebase
                                    .firestore()
                                    .collection("highscores")
                                    .doc("time")
                                    .update({
                                        [loggedInUser.username]: +value,
                                    });
                            } else {
                                const lowestUsernameAndScore = timeScoresFB.sort(
                                    (a, b) => b[1] - a[1]
                                )[0];

                                if (+value < lowestUsernameAndScore[1]) {
                                    await firebase
                                        .firestore()
                                        .collection("highscores")
                                        .doc("time")
                                        .update({
                                            [lowestUsernameAndScore[0]]: firebase.firestore.FieldValue.delete(),
                                            [loggedInUser.username]: +value,
                                        });
                                }
                            }
                        }
                    }
                } else {
                    if (key == "normalScore") {
                        setCurrentNormalScore(+value);
                    } else if (key == "speedScore") {
                        setCurrentSpeedScore(+value);
                    } else if (key == "timeScore") {
                        setCurrentTimeScore(+value);
                    }
                }
            } else {
                console.log(key, "empty");
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

    const playRecording = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require("../assets/sounds/firstSong.wav"),
            {
                shouldPlay: true,
                isLooping: true,
            },
            updateScreenForSoundStatus
        );
        music.current = sound;
        setMusicStatus("playing");
    };

    const updateScreenForSoundStatus = (status) => {
        if (status.isPlaying && musicStatus !== "playing") {
            setMusicStatus("playing");
            musicStatusRef.current = "playing";
        } else if (!status.isPlaying && musicStatus === "playing") {
            setMusicStatus("donePause");
            musicStatusRef.current = "donePause";
        }
    };

    const pauseAndPlayRecording = async (fromOtherScreen = false) => {
        let status;
        if (fromOtherScreen) {
            status = musicStatusRef.current;
        } else {
            status = musicStatus;
        }
        if (music.current) {
            if (status == "playing") {
                await music.current.pauseAsync();
                setMusicStatus("donePause");
                musicStatusRef.current = "donePause";
            } else {
                await music.current.playAsync();

                setMusicStatus("playing");
                musicStatusRef.current = "playing";
            }
        }
    };

    const syncPauseAndPlayRecording = () => {
        if (music.current) {
            if (musicStatus == "playing") {
                music.current.pauseAsync();
            } else {
                music.current.playAsync();
            }
        }
    };

    const playAndPause = () => {
        switch (musicStatus) {
            case "noSound":
                playRecording();
                break;
            case "donePause":
            case "playing":
                pauseAndPlayRecording();
                break;
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
            loggedInUser,
            currentNormalScore,
            currentSpeedScore,
            currentTimeScore,
            getNormalScoresRef,
            getSpeedScoresRef,
            getTimeScoresRef,
            setNormalScoresRef,
            setSpeedScoresRef,
            setTimeScoresRef,
            getCurrentNormalScoreRank,
            getCurrentSpeedScoreRank,
            getCurrentTimeScoreRank,
            setCurrentNormalScoreRank,
            setCurrentSpeedScoreRank,
            setCurrentTimeScoreRank,
            // pauseAndPlayRecording,
            // musicIsPlaying: musicStatus == "playing" ? true : false,
        });
    };

    const setNormalScoresRef = (normalScores) => {
        normalScoresRef.current = normalScores;
    };
    const setSpeedScoresRef = (speedScores) => {
        speedScoresRef.current = speedScores;
    };
    const setTimeScoresRef = (timeScores) => {
        timeScoresRef.current = timeScores;
    };

    const getNormalScoresRef = () => {
        return normalScoresRef.current;
    };
    const getSpeedScoresRef = () => {
        return speedScoresRef.current;
    };
    const getTimeScoresRef = () => {
        return timeScoresRef.current;
    };

    const setCurrentNormalScoreRank = (rank) => {
        currentNormalScoreRank.current = rank;
    };
    const setCurrentSpeedScoreRank = (rank) => {
        currentSpeedScoreRank.current = rank;
    };
    const setCurrentTimeScoreRank = (rank) => {
        currentTimeScoreRank.current = rank;
    };

    const getCurrentNormalScoreRank = () => {
        return currentNormalScoreRank.current;
    };
    const getCurrentSpeedScoreRank = () => {
        return currentSpeedScoreRank.current;
    };
    const getCurrentTimeScoreRank = () => {
        return currentTimeScoreRank.current;
    };

    const handleLogoutPress = () => {
        soundPress();

        firebase
            .auth()
            .signOut()
            .then(() => {
                console.log("user logged out:");
            });
        storeData("normalScore", "0");
        storeData("speedScore", "0");
        storeData("timeScore", "0");
        setLoggedInUser(null);
        setCurrentNormalScore(0);
        setCurrentSpeedScore(0);
        setCurrentTimeScore(0);
        setCurrentNormalScoreRank();
        setCurrentSpeedScoreRank();
        setCurrentTimeScoreRank();
        gamesPlayed.current = 0;
        normalScoresRef.current = "empty";
        speedScoresRef.current = "empty";
        timeScoresRef.current = "empty";
    };

    const handleHowToPlayPress = () => {
        soundPress();
        props.navigation.navigate("HowToPlay");
    };

    const handleGameModesPress = () => {
        soundPress();

        props.navigation.navigate("GameModes", {
            loggedInUser,
            mainDeck: props.extraData.mainDeck,
            currentNormalScore,
            currentSpeedScore,
            currentTimeScore,
            setCurrentNormalScore,
            setCurrentSpeedScore,
            setCurrentTimeScore,
            getGamesPlayed,
            increaseGamesPlayed,
            setNormalScoresRef,
            setSpeedScoresRef,
            setTimeScoresRef,
            getNormalScoresRef,
            getSpeedScoresRef,
            getTimeScoresRef,
            getCurrentNormalScoreRank,
            getCurrentSpeedScoreRank,
            getCurrentTimeScoreRank,
            setCurrentNormalScoreRank,
            setCurrentSpeedScoreRank,
            setCurrentTimeScoreRank,
            storeData,
            pauseAndPlayRecording,
            musicStatusRef: musicStatusRef.current,
        });
    };

    const fancyTimeFormat = (duration) => {
        var hrs = ~~(duration / 3600);
        var mins = ~~((duration % 3600) / 60);
        var secs = ~~duration % 60;
        var ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    };

    const handleRegisterPress = async () => {
        soundPress();
        if ((await Network.getNetworkStateAsync()).isConnected) {
            setModalStatus("reg");
        } else {
            handleNoConnection();
        }
    };

    const handleLoginPress = async () => {
        soundPress();
        if ((await Network.getNetworkStateAsync()).isConnected) {
            setModalStatus("login");
        } else {
            handleNoConnection();
        }
    };

    const handleNoConnection = () => {
        Alert.alert(
            "Oops! No internet connection found",
            "",
            [
                {
                    text: "Dismiss",
                    onPress: () => console.log("dismissed"),
                    style: "cancel",
                },
            ],
            { cancelable: false }
        );
    };

    const handleSettingsPress = () => {
        soundPress();

        props.navigation.navigate("Settings", {
            loggedInUser,
            handleLogoutPress,
        });
    };

    return (
        <View style={styles.container}>
            <ScrollingBackground
                style={styles.scrollingBackground}
                speed={10}
                direction={"left"}
                images={[require("../assets/images/doodle3c.jpg")]}
            />
            <TouchableOpacity style={styles.musicButton} onPress={playAndPause}>
                {musicStatus != "playing" ? (
                    <FontAwesomeIcon
                        style={styles.musicSlash}
                        icon={faSlash}
                        size={24}
                    />
                ) : (
                    <Text></Text>
                )}
                {musicStatus == "playing" ? (
                    <FontAwesomeIcon icon={faMusic} size={24} />
                ) : (
                    <FontAwesomeIcon
                        icon={faMusic}
                        size={24}
                        color={"#b5b5b5"}
                    />
                )}
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.settingsButton}
                onPress={handleSettingsPress}
            >
                <FontAwesomeIcon icon={faCog} size={24} />
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
                Card Cram
            </Text>
            {loggedInUser ? (
                <View style={styles.usernameContainer}>
                    <Text style={styles.usernameText}>
                        {loggedInUser.username}
                    </Text>
                    <View style={styles.scoresOuterContainer}>
                        <View style={styles.scoresContainer}>
                            <Text style={styles.bestText}>
                                Normal:{" "}
                                <Text style={styles.scoreText}>
                                    {currentNormalScore}
                                </Text>
                            </Text>
                            <Text style={styles.bestText}>
                                Speed:{" "}
                                <Text style={styles.speedText}>
                                    {currentSpeedScore}
                                </Text>
                            </Text>
                            <Text style={styles.bestText}>
                                Time:{" "}
                                <Text style={styles.timeText}>
                                    {fancyTimeFormat(currentTimeScore)}
                                </Text>
                            </Text>
                        </View>
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
                {isSmallDevice.current ? (
                    <SmallFlatButton
                        title="Game Modes"
                        onPress={handleGameModesPress}
                    />
                ) : (
                    <FlatButton
                        title="Game Modes"
                        onPress={handleGameModesPress}
                    />
                )}

                {isSmallDevice.current ? (
                    <SmallFlatButton
                        title="How to Play"
                        onPress={handleHowToPlayPress}
                    />
                ) : (
                    <FlatButton
                        title="How to Play"
                        onPress={handleHowToPlayPress}
                    />
                )}
                {isSmallDevice.current ? (
                    <SmallFlatButton
                        title={"Leader Board"}
                        onPress={handleLeaderBoardPress}
                    />
                ) : (
                    <FlatButton
                        title={"Leader Board"}
                        onPress={handleLeaderBoardPress}
                    />
                )}

                {loggedInUser ? (
                    isSmallDevice.current ? (
                        <SmallFlatButton
                            title="Logout"
                            onPress={handleLogoutPress}
                        />
                    ) : (
                        <FlatButton
                            title="Logout"
                            onPress={handleLogoutPress}
                        />
                    )
                ) : (
                    <View>
                        {isSmallDevice.current ? (
                            <SmallFlatButton
                                title="Register Account"
                                onPress={handleRegisterPress}
                            />
                        ) : (
                            <FlatButton
                                title="Register Account"
                                onPress={handleRegisterPress}
                            />
                        )}
                        {isSmallDevice.current ? (
                            <SmallFlatButton
                                title="Login"
                                onPress={handleLoginPress}
                            />
                        ) : (
                            <FlatButton
                                title="Login"
                                onPress={handleLoginPress}
                            />
                        )}
                    </View>
                )}
            </View>
            <AdMobBanner
                style={styles.ad}
                bannerSize={"smartBannerPortrait"}
                // adUnitID="ca-app-pub-3940256099942544/2934735716" //Test
                adUnitID="ca-app-pub-4308697206344728/2998737278" //Real
                onDidFailToReceiveAdWithError={() => console.log("ad error")}
            />

            <Modal visible={modalStatus == "reg"} animationType="slide">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Create Account</Text>

                        <RegisterForm
                            closeModal={() => setModalStatus("close")}
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
            {/* <StatusBar hidden={true} /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    musicButton: {
        position: "absolute",
        bottom: "10%",
        right: 10,
    },
    settingsButton: {
        position: "absolute",
        bottom: "10%",
        right: 40,
    },
    musicSlash: {
        transform: [{ translateY: 25 }],
        zIndex: 99,
    },
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
        maxWidth: 500,
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
    smallBanner: {
        position: "absolute",
        top: 10,
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
        top: 105,
    },
    smallTitle: {
        fontFamily: "nunito-bold",
        fontSize: 28,
        // marginBottom: 100,
        position: "absolute",
        top: 50,
    },
    scrollingBackground: {
        backgroundColor: "#fff",
    },
    usernameContainer: {
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "black",
        position: "absolute",
        top: "27%",
        maxWidth: 362,
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
    scoresOuterContainer: {
        width: "100%",
        alignItems: "center",
    },
    scoresContainer: {
        maxWidth: 150,
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
        bottom: "7%",
    },
    buttonsLoggedInContainer: {
        position: "absolute",
        bottom: "7%",
    },
    smallDevice: {
        transform: [{ scale: 0.8 }],
    },
});
