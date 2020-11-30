import React, { useEffect, useRef, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import FlatButtonBig from "../shared/flatButtonBig";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { faSlash } from "@fortawesome/free-solid-svg-icons";
import ScrollingBackground from "react-native-scrolling-images";
import { Audio } from "expo-av";
import { AdMobBanner, AdMobInterstitial } from "expo-ads-admob";
import * as Network from "expo-network";

export default function GameModes(props) {
    const selectedGameMode = useRef();
    const [musicStatus, setMusicStatus] = useState(
        props.route.params.musicStatusRef
    );
    useEffect(() => {
        AdMobInterstitial.addEventListener("interstitialDidLoad", () => {
            if (getMusicStatus() == "playing") {
                props.route.params.pauseAndPlayRecording(true);
            }
        });
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
            if (getMusicStatus() == "playing") {
                props.route.params.pauseAndPlayRecording(true);
            }

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
        soundPress();
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
        props.navigation.navigate("Game", {
            loggedInUser: props.route.params.loggedInUser,
            highscore: props.route.params.currentNormalScore,
            setHighscore: props.route.params.setCurrentNormalScore,
            gameMode: "normal",
            time: 15,
            sampleDeckSize: 9,
            mainDeck: props.route.params.mainDeck,
            getGamesPlayed: props.route.params.getGamesPlayed,
            increaseGamesPlayed: props.route.params.increaseGamesPlayed,
            setNormalScoresRef: props.route.params.setNormalScoresRef,
            getNormalScoresRef: props.route.params.getNormalScoresRef,
            setSpeedScoresRef: props.route.params.setSpeedScoresRef,
            getSpeedScoresRef: props.route.params.getSpeedScoresRef,
            setTimeScoresRef: props.route.params.setTimeScoresRef,
            getTimeScoresRef: props.route.params.getTimeScoresRef,
            getCurrentNormalScoreRank:
                props.route.params.getCurrentNormalScoreRank,
            getCurrentSpeedScoreRank:
                props.route.params.getCurrentSpeedScoreRank,
            getCurrentTimeScoreRank: props.route.params.getCurrentTimeScoreRank,
            setCurrentNormalScoreRank:
                props.route.params.setCurrentNormalScoreRank,
            setCurrentSpeedScoreRank:
                props.route.params.setCurrentSpeedScoreRank,
            setCurrentTimeScoreRank: props.route.params.setCurrentTimeScoreRank,
            storeData: props.route.params.storeData,
            getCurrentNormalScore: props.route.params.currentNormalScore,
            getCurrentSpeedScore: props.route.params.currentSpeedScore,
            getCurrentTimeScore: props.route.params.currentTimeScore,
            pauseAndPlayRecording: props.route.params.pauseAndPlayRecording,
            musicStatus,
        });
    };

    const startSpeedGame = () => {
        removeListenersForAd();
        props.navigation.navigate("Game", {
            loggedInUser: props.route.params.loggedInUser,
            highscore: props.route.params.currentSpeedScore,
            setHighscore: props.route.params.setCurrentSpeedScore,
            gameMode: "speed",
            time: 5,
            sampleDeckSize: 3,
            mainDeck: props.route.params.mainDeck,
            getGamesPlayed: props.route.params.getGamesPlayed,
            increaseGamesPlayed: props.route.params.increaseGamesPlayed,
            setNormalScoresRef: props.route.params.setNormalScoresRef,
            getNormalScoresRef: props.route.params.getNormalScoresRef,
            setSpeedScoresRef: props.route.params.setSpeedScoresRef,
            getSpeedScoresRef: props.route.params.getSpeedScoresRef,
            setTimeScoresRef: props.route.params.setTimeScoresRef,
            getTimeScoresRef: props.route.params.getTimeScoresRef,
            getCurrentNormalScoreRank:
                props.route.params.getCurrentNormalScoreRank,
            getCurrentSpeedScoreRank:
                props.route.params.getCurrentSpeedScoreRank,
            getCurrentTimeScoreRank: props.route.params.getCurrentTimeScoreRank,
            setCurrentNormalScoreRank:
                props.route.params.setCurrentNormalScoreRank,
            setCurrentSpeedScoreRank:
                props.route.params.setCurrentSpeedScoreRank,
            setCurrentTimeScoreRank: props.route.params.setCurrentTimeScoreRank,
            storeData: props.route.params.storeData,
            getCurrentNormalScore: props.route.params.currentNormalScore,
            getCurrentSpeedScore: props.route.params.currentSpeedScore,
            getCurrentTimeScore: props.route.params.currentTimeScore,
            pauseAndPlayRecording: props.route.params.pauseAndPlayRecording,
            musicStatus,
        });
    };
    const startTimeGame = () => {
        removeListenersForAd();
        props.navigation.navigate("TimeGame", {
            loggedInUser: props.route.params.loggedInUser,
            highscore: props.route.params.currentTimeScore,
            setHighscore: props.route.params.setCurrentTimeScore,
            deckSize: 50,
            sampleDeckSize: 9,
            mainDeck: props.route.params.mainDeck,
            getGamesPlayed: props.route.params.getGamesPlayed,
            increaseGamesPlayed: props.route.params.increaseGamesPlayed,
            setNormalScoresRef: props.route.params.setNormalScoresRef,
            getNormalScoresRef: props.route.params.getNormalScoresRef,
            setSpeedScoresRef: props.route.params.setSpeedScoresRef,
            getSpeedScoresRef: props.route.params.getSpeedScoresRef,
            setTimeScoresRef: props.route.params.setTimeScoresRef,
            getTimeScoresRef: props.route.params.getTimeScoresRef,
            getCurrentNormalScoreRank:
                props.route.params.getCurrentNormalScoreRank,
            getCurrentSpeedScoreRank:
                props.route.params.getCurrentSpeedScoreRank,
            getCurrentTimeScoreRank: props.route.params.getCurrentTimeScoreRank,
            setCurrentNormalScoreRank:
                props.route.params.setCurrentNormalScoreRank,
            setCurrentSpeedScoreRank:
                props.route.params.setCurrentSpeedScoreRank,
            setCurrentTimeScoreRank: props.route.params.setCurrentTimeScoreRank,
            storeData: props.route.params.storeData,
            getCurrentNormalScore: props.route.params.currentNormalScore,
            getCurrentSpeedScore: props.route.params.currentSpeedScore,
            getCurrentTimeScore: props.route.params.currentTimeScore,
            pauseAndPlayRecording: props.route.params.pauseAndPlayRecording,
            musicStatus,
        });
    };

    const handleGamePress = async () => {
        soundPress();
        const networkConnection = await (await Network.getNetworkStateAsync())
            .isConnected;

        if (
            props.route.params.getGamesPlayed() % 5 == 0 &&
            props.route.params.getGamesPlayed() != 0
        ) {
            if (networkConnection) {
                showVideoAd();
            } else {
                handleNoConnection();
            }
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

    const switchMusicStatus = () => {
        if (musicStatus == "playing") {
            setMusicStatus("paused");
        } else {
            setMusicStatus("playing");
        }
    };

    const getMusicStatus = () => {
        return musicStatus;
    };

    const handleNoConnection = () => {
        Alert.alert(
            "Oops! No internet connection found",
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
    };

    return (
        <View style={styles.container}>
            <ScrollingBackground
                style={styles.scrollingBackground}
                speed={10}
                direction={"left"}
                images={[require("../assets/images/doodle3c.jpg")]}
            />
            <TouchableOpacity
                style={styles.musicButton}
                onPress={async () => {
                    await props.route.params.pauseAndPlayRecording(true);
                    switchMusicStatus();
                }}
            >
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
    musicButton: {
        position: "absolute",
        bottom: 60,
        right: 10,
    },
    musicSlash: {
        zIndex: 99,
        transform: [{ translateY: 25 }],
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
