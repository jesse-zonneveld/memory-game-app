import React, { useEffect, useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ImageBackground,
} from "react-native";
import FlatButtonBig from "../shared/flatButtonBig";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import ScrollingBackground from "react-native-scrolling-images";
import { Audio } from "expo-av";
import { AdMobBanner, AdMobInterstitial } from "expo-ads-admob";

export default function GameModes(props) {
    const selectedGameMode = useRef();
    useEffect(() => {
        AdMobInterstitial.addEventListener("interstitialDidLoad", () =>
            console.log("videoloaded")
        );
        AdMobInterstitial.addEventListener("interstitialDidFailToLoad", () =>
            console.log("failedtoload")
        );
        AdMobInterstitial.addEventListener("interstitialDidOpen", () =>
            console.log("opened")
        );
        AdMobInterstitial.addEventListener(
            "interstitialWillLeaveApplication",
            () => console.log("leaveapp")
        );
        AdMobInterstitial.addEventListener("interstitialDidClose", () => {
            if (selectedGameMode.current == "normal") {
                startNormalGame();
            } else if (selectedGameMode.current == "speed") {
                startSpeedGame();
            } else {
                startTimeGame();
            }
            props.route.params.increaseGamesPlayed();
        });
    }, []);
    const handleBackToMenuPress = () => {
        props.navigation.navigate("Home");
    };

    const removeListenersForAd = () => {
        AdMobInterstitial.removeAllListeners();
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

    const showVideoAd = async () => {
        await AdMobInterstitial.setAdUnitID(
            "ca-app-pub-3940256099942544/5135589807" // test
        );
        await AdMobInterstitial.requestAdAsync({
            servePersonalizedAds: true,
        });
        await AdMobInterstitial.showAdAsync();
    };

    const startNormalGame = () => {
        removeListenersForAd();
        if (props.route.params.loggedInUser) {
            props.navigation.navigate("Game", {
                loggedInUser: props.route.params.loggedInUser,
                highscore: props.route.params.currentHighscore,
                setCurrentHighscore: props.route.params.setCurrentHighscore,
                gameMode: "normal",
                time: 15,
                deckSize: 400,
                sampleDeckSize: 9,
                mainDeck: props.route.params.mainDeck,
                getGamesPlayed: props.route.params.getGamesPlayed,
                increaseGamesPlayed: props.route.params.increaseGamesPlayed,
                setHighscoresRef: props.route.params.setHighscoresRef,
                getHighscoresRef: props.route.params.getHighscoresRef,
                setSpeedScoresRef: props.route.params.setSpeedScoresRef,
                getSpeedScoresRef: props.route.params.getSpeedScoresRef,
                setTimeScoresRef: props.route.params.setTimeScoresRef,
                getTimeScoresRef: props.route.params.getTimeScoresRef,
                getCurrentHighscoreRank:
                    props.route.params.getCurrentHighscoreRank,
                getCurrentSpeedScoreRank:
                    props.route.params.getCurrentSpeedScoreRank,
                getCurrentTimeScoreRank:
                    props.route.params.getCurrentTimeScoreRank,
                setCurrentHighscoreRank:
                    props.route.params.setCurrentHighscoreRank,
                setCurrentSpeedScoreRank:
                    props.route.params.setCurrentSpeedScoreRank,
                setCurrentTimeScoreRank:
                    props.route.params.setCurrentTimeScoreRank,
                storeData: props.route.params.storeData,
                getCurrentHighscore: props.route.params.currentHighscore,
                getCurrentSpeedScore: props.route.params.currentSpeedScore,
                getCurrentTimeScore: props.route.params.currentTimeScore,
            });
        } else {
            props.navigation.navigate("Game", {
                loggedInUser: null,
                highscore: props.route.params.currentHighscore,
                setCurrentHighscore: props.route.params.setCurrentHighscore,
                gameMode: "normal",
                time: 15,
                deckSize: 400,
                sampleDeckSize: 9,
                mainDeck: props.route.params.mainDeck,
                getGamesPlayed: props.route.params.getGamesPlayed,
                increaseGamesPlayed: props.route.params.increaseGamesPlayed,
                setHighscoresRef: props.route.params.setHighscoresRef,
                getHighscoresRef: props.route.params.getHighscoresRef,
                setSpeedScoresRef: props.route.params.setSpeedScoresRef,
                getSpeedScoresRef: props.route.params.getSpeedScoresRef,
                setTimeScoresRef: props.route.params.setTimeScoresRef,
                getTimeScoresRef: props.route.params.getTimeScoresRef,
                getCurrentHighscoreRank:
                    props.route.params.getCurrentHighscoreRank,
                getCurrentSpeedScoreRank:
                    props.route.params.getCurrentSpeedScoreRank,
                getCurrentTimeScoreRank:
                    props.route.params.getCurrentTimeScoreRank,
                setCurrentHighscoreRank:
                    props.route.params.setCurrentHighscoreRank,
                setCurrentSpeedScoreRank:
                    props.route.params.setCurrentSpeedScoreRank,
                setCurrentTimeScoreRank:
                    props.route.params.setCurrentTimeScoreRank,
                storeData: props.route.params.storeData,
                getCurrentHighscore: props.route.params.currentHighscore,
                getCurrentSpeedScore: props.route.params.currentSpeedScore,
                getCurrentTimeScore: props.route.params.currentTimeScore,
            });
        }
    };
    const startSpeedGame = () => {
        removeListenersForAd();

        if (props.route.params.loggedInUser) {
            props.navigation.navigate("Game", {
                loggedInUser: props.route.params.loggedInUser,
                highscore: props.route.params.currentSpeedScore,
                setCurrentHighscore: props.route.params.setCurrentSpeedScore,
                gameMode: "speed",
                time: 5,
                deckSize: 400,
                sampleDeckSize: 3,
                mainDeck: props.route.params.mainDeck,
                getGamesPlayed: props.route.params.getGamesPlayed,
                increaseGamesPlayed: props.route.params.increaseGamesPlayed,
                setHighscoresRef: props.route.params.setHighscoresRef,
                getHighscoresRef: props.route.params.getHighscoresRef,
                setSpeedScoresRef: props.route.params.setSpeedScoresRef,
                getSpeedScoresRef: props.route.params.getSpeedScoresRef,
                setTimeScoresRef: props.route.params.setTimeScoresRef,
                getTimeScoresRef: props.route.params.getTimeScoresRef,
                getCurrentHighscoreRank:
                    props.route.params.getCurrentHighscoreRank,
                getCurrentSpeedScoreRank:
                    props.route.params.getCurrentSpeedScoreRank,
                getCurrentTimeScoreRank:
                    props.route.params.getCurrentTimeScoreRank,
                setCurrentHighscoreRank:
                    props.route.params.setCurrentHighscoreRank,
                setCurrentSpeedScoreRank:
                    props.route.params.setCurrentSpeedScoreRank,
                setCurrentTimeScoreRank:
                    props.route.params.setCurrentTimeScoreRank,
                storeData: props.route.params.storeData,
                getCurrentHighscore: props.route.params.currentHighscore,
                getCurrentSpeedScore: props.route.params.currentSpeedScore,
                getCurrentTimeScore: props.route.params.currentTimeScore,
            });
        } else {
            props.navigation.navigate("Game", {
                loggedInUser: null,
                highscore: props.route.params.currentSpeedScore,
                setCurrentSpeedScore: props.route.params.setCurrentSpeedScore,
                gameMode: "speed",
                time: 5,
                deckSize: 400,
                sampleDeckSize: 3,
                mainDeck: props.route.params.mainDeck,
                getGamesPlayed: props.route.params.getGamesPlayed,
                increaseGamesPlayed: props.route.params.increaseGamesPlayed,
                setHighscoresRef: props.route.params.setHighscoresRef,
                getHighscoresRef: props.route.params.getHighscoresRef,
                setSpeedScoresRef: props.route.params.setSpeedScoresRef,
                getSpeedScoresRef: props.route.params.getSpeedScoresRef,
                setTimeScoresRef: props.route.params.setTimeScoresRef,
                getTimeScoresRef: props.route.params.getTimeScoresRef,
                getCurrentHighscoreRank:
                    props.route.params.getCurrentHighscoreRank,
                getCurrentSpeedScoreRank:
                    props.route.params.getCurrentSpeedScoreRank,
                getCurrentTimeScoreRank:
                    props.route.params.getCurrentTimeScoreRank,
                setCurrentHighscoreRank:
                    props.route.params.setCurrentHighscoreRank,
                setCurrentSpeedScoreRank:
                    props.route.params.setCurrentSpeedScoreRank,
                setCurrentTimeScoreRank:
                    props.route.params.setCurrentTimeScoreRank,
                storeData: props.route.params.storeData,
                getCurrentHighscore: props.route.params.currentHighscore,
                getCurrentSpeedScore: props.route.params.currentSpeedScore,
                getCurrentTimeScore: props.route.params.currentTimeScore,
            });
        }
    };
    const startTimeGame = () => {
        removeListenersForAd();

        if (props.route.params.loggedInUser) {
            props.navigation.navigate("TimeGame", {
                loggedInUser: props.route.params.loggedInUser,
                highscore: props.route.params.currentTimeScore,
                setCurrentHighscore: props.route.params.setCurrentTimeScore,
                deckSize: 50,
                sampleDeckSize: 9,
                mainDeck: props.route.params.mainDeck,
                getGamesPlayed: props.route.params.getGamesPlayed,
                increaseGamesPlayed: props.route.params.increaseGamesPlayed,
                setHighscoresRef: props.route.params.setHighscoresRef,
                getHighscoresRef: props.route.params.getHighscoresRef,
                setSpeedScoresRef: props.route.params.setSpeedScoresRef,
                getSpeedScoresRef: props.route.params.getSpeedScoresRef,
                setTimeScoresRef: props.route.params.setTimeScoresRef,
                getTimeScoresRef: props.route.params.getTimeScoresRef,
                getCurrentHighscoreRank:
                    props.route.params.getCurrentHighscoreRank,
                getCurrentSpeedScoreRank:
                    props.route.params.getCurrentSpeedScoreRank,
                getCurrentTimeScoreRank:
                    props.route.params.getCurrentTimeScoreRank,
                setCurrentHighscoreRank:
                    props.route.params.setCurrentHighscoreRank,
                setCurrentSpeedScoreRank:
                    props.route.params.setCurrentSpeedScoreRank,
                setCurrentTimeScoreRank:
                    props.route.params.setCurrentTimeScoreRank,
                storeData: props.route.params.storeData,
                getCurrentHighscore: props.route.params.currentHighscore,
                getCurrentSpeedScore: props.route.params.currentSpeedScore,
                getCurrentTimeScore: props.route.params.currentTimeScore,
            });
        } else {
            props.navigation.navigate("TimeGame", {
                loggedInUser: null,
                highscore: props.route.params.currentTimeScore,
                setCurrentTimeScore: props.route.params.setCurrentTimeScore,
                deckSize: 50,
                sampleDeckSize: 9,
                mainDeck: props.route.params.mainDeck,
                getGamesPlayed: props.route.params.getGamesPlayed,
                increaseGamesPlayed: props.route.params.increaseGamesPlayed,
                setHighscoresRef: props.route.params.setHighscoresRef,
                getHighscoresRef: props.route.params.getHighscoresRef,
                setSpeedScoresRef: props.route.params.setSpeedScoresRef,
                getSpeedScoresRef: props.route.params.getSpeedScoresRef,
                setTimeScoresRef: props.route.params.setTimeScoresRef,
                getTimeScoresRef: props.route.params.getTimeScoresRef,
                getCurrentHighscoreRank:
                    props.route.params.getCurrentHighscoreRank,
                getCurrentSpeedScoreRank:
                    props.route.params.getCurrentSpeedScoreRank,
                getCurrentTimeScoreRank:
                    props.route.params.getCurrentTimeScoreRank,
                setCurrentHighscoreRank:
                    props.route.params.setCurrentHighscoreRank,
                setCurrentSpeedScoreRank:
                    props.route.params.setCurrentSpeedScoreRank,
                setCurrentTimeScoreRank:
                    props.route.params.setCurrentTimeScoreRank,
                storeData: props.route.params.storeData,
                getCurrentHighscore: props.route.params.currentHighscore,
                getCurrentSpeedScore: props.route.params.currentSpeedScore,
                getCurrentTimeScore: props.route.params.currentTimeScore,
            });
        }
    };

    const handleGamePress = () => {
        soundPress();
        if (
            props.route.params.getGamesPlayed() % 5 == 0 &&
            props.route.params.getGamesPlayed() != 0
        ) {
            showVideoAd();
        } else {
            if (selectedGameMode.current == "normal") {
                startNormalGame();
            } else if (selectedGameMode.current == "speed") {
                startSpeedGame();
            } else {
                startTimeGame();
            }
        }
    };

    // const handleSpeedGamePress = (gameMode, time, deckSize, sampleDeckSize) => {
    //     soundPress();

    //     if (props.route.params.loggedInUser) {
    //         props.navigation.navigate("Game", {
    //             loggedInUser: props.route.params.loggedInUser,
    //             highscore: props.route.params.currentSpeedScore,
    //             setCurrentHighscore: props.route.params.setCurrentSpeedScore,
    //             gameMode,
    //             time,
    //             deckSize,
    //             sampleDeckSize,
    //             mainDeck: props.route.params.mainDeck,
    //             gamesPlayed: props.route.params.getGamesPlayed,
    //             increaseGamesPlayed: props.route.params.increaseGamesPlayed,
    //         });
    //     } else {
    //         props.navigation.navigate("Game", {
    //             loggedInUser: null,
    //             highscore: 0,
    //             gameMode,
    //             time,
    //             deckSize,
    //             sampleDeckSize,
    //             mainDeck: props.route.params.mainDeck,
    //             gamesPlayed: props.route.params.getGamesPlayed,
    //             increaseGamesPlayed: props.route.params.increaseGamesPlayed,
    //         });
    //     }
    // };

    // const handleTimeGamePress = (deckSize, sampleDeckSize) => {
    //     soundPress();

    //     if (props.route.params.loggedInUser) {
    //         props.navigation.navigate("TimeGame", {
    //             loggedInUser: props.route.params.loggedInUser,
    //             highscore: props.route.params.currentTimeScore,
    //             setCurrentHighscore: props.route.params.setCurrentTimeScore,
    //             deckSize,
    //             sampleDeckSize,
    //             mainDeck: props.route.params.mainDeck,
    //             gamesPlayed: props.route.params.getGamesPlayed,
    //             increaseGamesPlayed: props.route.params.increaseGamesPlayed,
    //         });
    //     } else {
    //         props.navigation.navigate("TimeGame", {
    //             loggedInUser: null,
    //             highscore: 0,
    //             deckSize,
    //             sampleDeckSize,
    //             mainDeck: props.route.params.mainDeck,
    //             gamesPlayed: props.route.params.getGamesPlayed,
    //             increaseGamesPlayed: props.route.params.increaseGamesPlayed,
    //         });
    //     }
    // };

    return (
        <View style={styles.container}>
            <ScrollingBackground
                style={styles.scrollingBackground}
                speed={10}
                direction={"left"}
                images={[require("../assets/images/doodle3c.jpg")]}
            />
            <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackToMenuPress}
            >
                <FontAwesomeIcon icon={faChevronLeft} size={24} />
                <Text style={styles.backText}>Menu</Text>
            </TouchableOpacity>
            <Image
                source={require("../assets/images/bannerBlue.png")}
                style={styles.banner}
            />
            <Text style={styles.title}>Game Modes</Text>
            <View style={styles.buttonsContainer}>
                <FlatButtonBig
                    title="Normal"
                    onPress={() => {
                        selectedGameMode.current = "normal";
                        handleGamePress();
                    }}
                    color={"#f01d71"}
                />
                <FlatButtonBig
                    title="Speed Round"
                    onPress={() => {
                        selectedGameMode.current = "speed";
                        handleGamePress();
                    }}
                    color={"#1E72F1"}
                />
                <FlatButtonBig
                    title="Timed 50"
                    onPress={() => {
                        selectedGameMode.current = "time";
                        handleGamePress();
                    }}
                    color={"#E31EF1"}
                />
            </View>
            <AdMobBanner
                style={styles.ad}
                adUnitID="ca-app-pub-3940256099942544/2934735716"
                onDidFailToReceiveAdWithError={() => console.log("ad error")}
            />
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
