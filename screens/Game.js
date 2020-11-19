import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    ImageBackground,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import FlatButton from "../shared/flatButton";
import { Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import firebase from "../firebase/config";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Audio } from "expo-av";
import { AdMobBanner, AdMobInterstitial } from "expo-ads-admob";

export default function Game(props) {
    const playingDeck = useRef(
        [...props.route.params.mainDeck]
            .sort(() => Math.random() - 0.5)
            .slice(0, props.route.params.deckSize)
    );

    const [sampleDeck, setSampleDeck] = useState(
        playingDeck.current.slice(0, props.route.params.sampleDeckSize)
    );
    const [gameStatus, setGameStatus] = useState("playing");
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(props.route.params.highscore);
    const prevBestScore = useRef(props.route.params.highscore);
    const [timeLeft, setTimeLeft] = useState(props.route.params.time);
    const tintColor = useRef("#72F11E");
    const seenCards = useRef([]);
    const stopTimer = useRef(false);
    const [confetti, setConfetti] = useState(false);

    useLayoutEffect(() => {
        if (stopTimer.current == false) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            if (timeLeft < 0) {
                setGameStatus("lose");
            }
            const time = props.route.params.time;
            tintColor.current =
                "#" +
                calculateMiddleColor({
                    color1: "E54C49",
                    color2: "72F11E",
                    ratio: timeLeft / time,
                });
            // Clear timeout if the component is unmounted
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    useEffect(() => {
        if (gameStatus == "win" || gameStatus == "lose") {
            props.route.params.increaseGamesPlayed();

            if (props.route.params.loggedInUser) {
                updateHighscoreLoggedIn();
            } else {
                updateHighscore();
            }
            if (score > bestScore) {
                winSound();
                setConfetti(true);
                timerForConfetti();
            }
        }
        if (gameStatus == "lose") {
            badSound();
        }
    }, [gameStatus]);

    const timerForConfetti = () => {
        setTimeout(() => setConfetti(false), 5000);
    };

    const goodSound = async () => {
        try {
            const {
                sound: soundObject,
                status,
            } = await Audio.Sound.createAsync(
                require("../assets/sounds/correct.wav"),
                { shouldPlay: true }
            );
            await soundObject.playAsync();
        } catch (error) {
            console.log(error);
        }
    };

    const badSound = async () => {
        try {
            const {
                sound: soundObject,
                status,
            } = await Audio.Sound.createAsync(
                require("../assets/sounds/incorrect.mp3"),
                { shouldPlay: true }
            );
            await soundObject.playAsync();
        } catch (error) {
            console.log(error);
        }
    };

    const winSound = async () => {
        try {
            const {
                sound: soundObject,
                status,
            } = await Audio.Sound.createAsync(
                require("../assets/sounds/win.wav"),
                { shouldPlay: true }
            );
            await soundObject.playAsync();
        } catch (error) {
            console.log(error);
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

    const calculateMiddleColor = ({
        color1 = "FF0000",
        color2 = "00FF00",
        ratio,
    }) => {
        const hex = (color) => {
            const colorString = color.toString(16);
            return colorString.length === 1 ? `0${colorString}` : colorString;
        };

        const r = Math.ceil(
            parseInt(color2.substring(0, 2), 16) * ratio +
                parseInt(color1.substring(0, 2), 16) * (1 - ratio)
        );
        const g = Math.ceil(
            parseInt(color2.substring(2, 4), 16) * ratio +
                parseInt(color1.substring(2, 4), 16) * (1 - ratio)
        );
        const b = Math.ceil(
            parseInt(color2.substring(4, 6), 16) * ratio +
                parseInt(color1.substring(4, 6), 16) * (1 - ratio)
        );

        return hex(r) + hex(g) + hex(b);
    };

    const handleExitPress = () => {
        Alert.alert(
            "Exit Current Game",
            "Are you sure you want to exit?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: "Quit Game",
                    onPress: () => props.navigation.navigate("Home"),
                },
            ],
            { cancelable: false }
        );
    };

    const handleBackToMenuPress = () => {
        soundPress();
        props.navigation.navigate("Home");
    };

    const handleCardPress = (card) => {
        updateGameStatus(card);
    };

    const updateGameStatus = (card) => {
        if (seenCards.current.some((seenCard) => seenCard == card)) {
            stopTimer.current = true;
            setGameStatus("lose");
        } else if (seenCards.current.length + 1 == playingDeck.current.length) {
            goodSound();
            setScore(score + 1);
            stopTimer.current = true;
            setGameStatus("win");
        } else {
            goodSound();
            setScore(score + 1);
            seenCards.current = [...seenCards.current, card];
            showNewSampleDeck();
            tintColor.current = "#72F11E";
            setTimeLeft(props.route.params.time);
        }
    };

    const showNewSampleDeck = () => {
        const newSampleDeck = [];
        shufflePlayingDeck();
        getRandomSeenCards().forEach((card) => newSampleDeck.push(card));
        newSampleDeck.push(getRandomUnseenCard());

        let i = 0;
        while (newSampleDeck.length < props.route.params.sampleDeckSize) {
            const nextCard = playingDeck.current[i];

            if (!newSampleDeck.some((card) => card == nextCard)) {
                newSampleDeck.push(nextCard);
            }
            i++;
        }

        setSampleDeck(newSampleDeck.sort(() => Math.random() - 0.5));
    };

    const getRandomSeenCards = () => {
        const shuffledSeenCards = [...seenCards.current].sort(
            () => Math.random() - 0.5
        );

        const cardsToAdd = [];
        if (props.route.params.gameMode == "normal") {
            if (shuffledSeenCards.length < 5) {
                for (let i = 0; i < shuffledSeenCards.length; i++) {
                    cardsToAdd.push(shuffledSeenCards[i]);
                }
            } else if (shuffledSeenCards.length < 50) {
                for (let i = 0; i < 5; i++) {
                    cardsToAdd.push(shuffledSeenCards[i]);
                }
            } else if (shuffledSeenCards.length < 200) {
                for (let i = 0; i < 3; i++) {
                    cardsToAdd.push(shuffledSeenCards[i]);
                }
            } else {
                cardsToAdd.push(shuffledSeenCards.pop());
            }
        } else {
            if (shuffledSeenCards.length % 5 == 0) {
                for (let i = 0; i < 2; i++) {
                    cardsToAdd.push(shuffledSeenCards[i]);
                }
            } else {
                cardsToAdd.push(shuffledSeenCards.pop());
            }
        }
        return cardsToAdd;
    };

    const getRandomUnseenCard = () => {
        return playingDeck.current.find(
            (card) => !seenCards.current.some((seenCard) => seenCard == card)
        );
    };

    const shufflePlayingDeck = () => {
        playingDeck.current = [...playingDeck.current].sort(
            () => Math.random() - 0.5
        );
    };

    const checkForAd = () => {
        if (
            props.route.params.getGamesPlayed() % 5 == 0 &&
            props.route.params.getGamesPlayed() != 0
        ) {
            AdMobInterstitial.addEventListener("interstitialDidLoad", () =>
                console.log("videoloaded")
            );
            AdMobInterstitial.addEventListener(
                "interstitialDidFailToLoad",
                () => console.log("failedtoload")
            );
            AdMobInterstitial.addEventListener("interstitialDidOpen", () =>
                console.log("opened")
            );
            AdMobInterstitial.addEventListener(
                "interstitialWillLeaveApplication",
                () => console.log("leaveapp")
            );
            AdMobInterstitial.addEventListener("interstitialDidClose", () => {
                restartGame();
                removeListenersForAd();
                props.route.params.increaseGamesPlayed();
            });
            showVideoAd();
        } else {
            restartGame();
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

    const removeListenersForAd = () => {
        AdMobInterstitial.removeAllListeners();
    };

    const restartGame = () => {
        soundPress();

        playingDeck.current = [...props.route.params.mainDeck]
            .sort(() => Math.random() - 0.5)
            .slice(0, props.route.params.deckSize);

        setSampleDeck(
            playingDeck.current.slice(0, props.route.params.sampleDeckSize)
        );
        seenCards.current = [];
        tintColor.current = "#72F11E";

        setScore(0);
        setGameStatus("playing");
        stopTimer.current = false;
        setTimeLeft(props.route.params.time);
        prevBestScore.current = bestScore;
    };

    const updateHighscore = () => {
        if (score > bestScore) {
            if (props.route.params.gameMode == "normal") {
                props.route.params.storeData("highscore", score.toString());
                setBestScore(score);
                props.route.params.setCurrentHighscore(score);
            } else if (props.route.params.gameMode == "speed") {
                props.route.params.storeData("speedScore", score.toString());
                setBestScore(score);
                props.route.params.setCurrentSpeedScore(score);
            }
        }
    };

    const updateHighscoreLoggedIn = async () => {
        if (score > bestScore) {
            setBestScore(score);
            props.route.params.setCurrentHighscore(score);
            if (props.route.params.gameMode == "normal") {
                props.route.params.storeData("highscore", score.toString());

                if (props.route.params.getHighscoresRef()) {
                    if (
                        props.route.params.getHighscoresRef()[
                            props.route.params.getHighscoresRef().length - 1
                        ].highscore < score
                    ) {
                        props.route.params.setHighscoresRef("empty");
                    }
                }
                console.log("beofe");
                let normalScoresFB = [];
                await firebase
                    .firestore()
                    .collection("highscores")
                    .doc("normal")
                    .get()
                    .then(function (doc) {
                        if (doc.exists) {
                            normalScoresFB = Object.entries(doc.data());
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                        }
                    })
                    .catch(function (error) {
                        console.log("Error getting document:", error);
                    });
                console.log("after");
                console.log(normalScoresFB);

                if (normalScoresFB.length < 5) {
                    await firebase
                        .firestore()
                        .collection("highscores")
                        .doc("normal")
                        .update({
                            [props.route.params.loggedInUser.username]: score,
                        });
                } else {
                    const lowestUsernameAndScore = normalScoresFB.sort(
                        (a, b) => a[1] - b[1]
                    )[0];
                    console.log(
                        lowestUsernameAndScore[0],
                        lowestUsernameAndScore[1],
                        score
                    );
                    if (score > lowestUsernameAndScore[1]) {
                        await firebase
                            .firestore()
                            .collection("highscores")
                            .doc("normal")
                            .update({
                                [lowestUsernameAndScore[0]]: firebase.firestore.FieldValue.delete(),
                                [props.route.params.loggedInUser
                                    .username]: score,
                            });
                    }
                }
                return firebase
                    .firestore()
                    .collection("users")
                    .doc(props.route.params.loggedInUser.id)
                    .update({
                        highscore: score,
                    })
                    .then(function () {
                        console.log("Document successfully updated!");
                    })
                    .catch(function (error) {
                        console.error("Error updating document: ", error);
                    });
            } else if (props.route.params.gameMode == "speed") {
                props.route.params.storeData("speedScore", score.toString());

                if (props.route.params.getSpeedScoresRef()) {
                    if (
                        props.route.params.getSpeedScoresRef()[
                            props.route.params.getSpeedScoresRef().length - 1
                        ].highscore < score
                    ) {
                        props.route.params.setSpeedScoresRef("empty");
                    }
                }

                let normalScoresFB = [];
                await firebase
                    .firestore()
                    .collection("highscores")
                    .doc("speed")
                    .get()
                    .then(function (doc) {
                        if (doc.exists) {
                            normalScoresFB = Object.entries(doc.data());
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                        }
                    })
                    .catch(function (error) {
                        console.log("Error getting document:", error);
                    });
                console.log("after");
                console.log(normalScoresFB);

                if (normalScoresFB.length < 5) {
                    await firebase
                        .firestore()
                        .collection("highscores")
                        .doc("speed")
                        .update({
                            [props.route.params.loggedInUser.username]: score,
                        });
                } else {
                    const lowestUsernameAndScore = normalScoresFB.sort(
                        (a, b) => a[1] - b[1]
                    )[0];
                    console.log(
                        lowestUsernameAndScore[0],
                        lowestUsernameAndScore[1],
                        score
                    );
                    if (score > lowestUsernameAndScore[1]) {
                        await firebase
                            .firestore()
                            .collection("highscores")
                            .doc("speed")
                            .update({
                                [lowestUsernameAndScore[0]]: firebase.firestore.FieldValue.delete(),
                                [props.route.params.loggedInUser
                                    .username]: score,
                            });
                    }
                }
                return firebase
                    .firestore()
                    .collection("users")
                    .doc(props.route.params.loggedInUser.id)
                    .update({
                        speedScore: score,
                    })
                    .then(function () {
                        console.log("Document successfully updated!");
                    })
                    .catch(function (error) {
                        console.error("Error updating document: ", error);
                    });
            }
        }
    };

    const handleLeaderBoardPress = () => {
        soundPress();

        if (props.route.params.gameMode == "normal") {
            props.navigation.navigate("LeaderBoard", {
                loggedInUser: props.route.params.loggedInUser,
                getHighscoresRef: props.route.params.getHighscoresRef,
                getSpeedScoresRef: props.route.params.getSpeedScoresRef,
                getTimeScoresRef: props.route.params.getTimeScoresRef,
                setHighscoresRef: props.route.params.setHighscoresRef,
                setSpeedScoresRef: props.route.params.setSpeedScoresRef,
                setTimeScoresRef: props.route.params.setTimeScoresRef,
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
                getCurrentHighscore: bestScore,
                getCurrentSpeedScore: props.route.params.getCurrentSpeedScore,
                getCurrentTimeScore: props.route.params.getCurrentTimeScore,
            });
        } else if (props.route.params.gameMode == "speed") {
            props.navigation.navigate("LeaderBoard", {
                loggedInUser: props.route.params.loggedInUser,
                getHighscoresRef: props.route.params.getHighscoresRef,
                getSpeedScoresRef: props.route.params.getSpeedScoresRef,
                getTimeScoresRef: props.route.params.getTimeScoresRef,
                setHighscoresRef: props.route.params.setHighscoresRef,
                setSpeedScoresRef: props.route.params.setSpeedScoresRef,
                setTimeScoresRef: props.route.params.setTimeScoresRef,
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
                getCurrentHighscore: props.route.params.getCurrentHighscore,
                getCurrentSpeedScore: bestScore,
                getCurrentTimeScore: props.route.params.getCurrentTimeScore,
            });
        }
    };

    return (
        <View style={styles.container}>
            <MaterialIcons
                name="close"
                size={24}
                style={styles.exitButton}
                onPress={handleExitPress}
            />
            {confetti ? (
                <ImageBackground
                    style={styles.confetti}
                    source={require("../assets/images/confetti.gif")}
                >
                    <Text style={styles.none}></Text>
                </ImageBackground>
            ) : (
                <Text style={styles.none}></Text>
            )}
            {(gameStatus == "lose" || gameStatus == "win") &&
            score > prevBestScore.current ? (
                <View style={styles.newBestScore}>
                    <Text style={styles.newBestScoreText}>New Highscore!</Text>
                </View>
            ) : (
                <Text></Text>
            )}

            <View style={styles.scoreBoard}>
                <View style={styles.currentScoreContainer}>
                    <Text style={styles.textTitle}>Current</Text>
                    <Text style={styles.textCurrentScore}>{score}</Text>
                </View>
                <View style={styles.bestScoreContainer}>
                    <Text style={styles.textTitle}>Best</Text>
                    <Text style={styles.textBestScore}>{bestScore}</Text>
                </View>
            </View>
            {gameStatus == "playing" ? (
                <FlatList
                    style={styles.cardsList}
                    numColumns={3}
                    keyExtractor={(item, index) => index.toString()}
                    data={sampleDeck}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => handleCardPress(item)}
                        >
                            <FontAwesomeIcon
                                icon={item}
                                size={32}
                                opacity={0.9}
                            />
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <View>
                    {gameStatus == "lose" ? (
                        <View style={styles.gameEndContainer}>
                            <Text style={styles.gameEndTitle}>Game Over</Text>
                            {stopTimer.current ? (
                                <Text style={styles.reasonText}>
                                    Oh no! You've already pressed that.
                                </Text>
                            ) : (
                                <Text style={styles.reasonText}>
                                    Oh no! You ran out of time.
                                </Text>
                            )}
                        </View>
                    ) : (
                        <View style={styles.gameEndContainer}>
                            <Text style={styles.gameEndTitle}>You Win!</Text>
                            <Text style={styles.reasonText}>
                                You successfully pressed every card once.
                            </Text>
                        </View>
                    )}
                    <View style={styles.buttonsContainer}>
                        {props.route.params.getGamesPlayed() % 5 == 0 &&
                        props.route.params.getGamesPlayed() != 0 ? (
                            <FlatButton
                                title="Play Again"
                                withVideo={true}
                                onPress={checkForAd}
                            />
                        ) : (
                            <FlatButton
                                title="Play Again"
                                onPress={checkForAd}
                            />
                        )}
                        <FlatButton
                            title="Leader Board"
                            withVideo={true}
                            onPress={handleLeaderBoardPress}
                        />
                        <FlatButton
                            title="Main Menu"
                            onPress={handleBackToMenuPress}
                        />
                    </View>
                </View>
            )}
            {timeLeft >= 0 && gameStatus == "playing" ? (
                <View style={styles.timerContainer}>
                    <AnimatedCircularProgress
                        size={100}
                        style={styles.timer}
                        width={20}
                        rotation={0}
                        fill={100 - (timeLeft / props.route.params.time) * 100}
                        tintColor="grey"
                        backgroundColor={tintColor.current}
                    >
                        {(fill) => (
                            <Text style={styles.timerText}>{timeLeft}</Text>
                        )}
                    </AnimatedCircularProgress>
                </View>
            ) : (
                <Text></Text>
            )}

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
        backgroundColor: "#FCFEEF",
        paddingTop: 50,
        flex: 1,
    },
    ad: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
    },
    exitButton: {
        position: "absolute",
        right: 0,
        top: 20,
        padding: 20,
        zIndex: 5,
    },
    none: {
        display: "none",
    },
    newBestScore: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    newBestScoreText: {
        fontSize: 30,
        fontWeight: "bold",

        color: "#a0c4ff",
    },
    scoreBoard: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    currentScoreContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: 120,
    },
    bestScoreContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: 120,
    },
    confetti: {
        position: "absolute",
        // resizeMode: "cover",
        height: "104%",
        top: 0,
        zIndex: -10,
        width: "100%",
        flex: 1,
    },
    textTitle: {
        fontSize: 20,
        paddingBottom: 10,
        fontWeight: "bold",
    },
    textBestScore: {
        color: "#1E72F1",
        fontSize: 25,
        fontWeight: "bold",
    },
    textCurrentScore: {
        color: "#E31EF1",
        fontSize: 25,
        fontWeight: "bold",
    },
    cardsList: {
        flex: 1,
        padding: 20,
    },
    card: {
        backgroundColor: "#1EF1E3",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
        height: Dimensions.get("screen").width / 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,

        elevation: 5,
    },
    timerContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 50,
    },
    timer: {
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,

        elevation: 5,
    },
    timerText: {
        fontSize: 25,
        fontWeight: "bold",
    },
    gameEndContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 75,
    },
    gameEndTitle: {
        fontSize: 35,
        fontWeight: "bold",
        marginBottom: 20,
    },
    reasonText: {
        fontSize: 20,
        width: Dimensions.get("screen").width / 1.2,
        textAlign: "center",
    },
    buttonsContainer: {
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
});
