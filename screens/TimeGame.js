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
import { Audio } from "expo-av";
import { AdMobBanner, AdMobInterstitial } from "expo-ads-admob";

export default function TimeGame(props) {
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
    const [currentTime, setCurrentTime] = useState(0);
    const [cardsLeft, setCardsLeft] = useState(props.route.params.deckSize);
    const goodColor = "#72F11E";
    const badColor = "#E54C49";
    const tintColor = useRef(goodColor);
    const seenCards = useRef([]);
    const stopTimer = useRef(false);
    const [confetti, setConfetti] = useState(false);

    useLayoutEffect(() => {
        if (stopTimer.current == false) {
            const timer = setTimeout(() => {
                setCurrentTime(currentTime + 1);
            }, 1000);

            if (bestScore > 0 && currentTime >= bestScore) {
                tintColor.current = badColor;
            }
            // Clear timeout if the component is unmounted
            return () => clearTimeout(timer);
        }
    }, [currentTime]);

    useEffect(() => {
        if (gameStatus == "win" || gameStatus == "lose") {
            props.route.params.increaseGamesPlayed();
            setScore(currentTime);

            if (
                gameStatus == "win" &&
                (currentTime < bestScore || bestScore == 0)
            ) {
                winSound();
                setConfetti(true);
                timerForConfetti();
            }
        }
        if (gameStatus == "lose") {
            badSound();
        }
    }, [gameStatus]);

    useEffect(() => {
        if (gameStatus == "win") {
            if (props.route.params.loggedInUser) {
                updateHighscoreLoggedIn();
            } else {
                updateHighscore();
            }
        }
    }, [score]);

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

    const handleExitPress = () => {
        Alert.alert(
            "Exit Current Game",
            "Are you sure you want to exit?",
            [
                {
                    text: "Cancel",
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
            stopTimer.current = true;
            goodSound();
            setGameStatus("win");
        } else {
            goodSound();
            setCardsLeft(cardsLeft - 1);
            seenCards.current = [...seenCards.current, card];
            showNewSampleDeck();
        }
    };

    const showNewSampleDeck = () => {
        const newSampleDeck = [];
        shufflePlayingDeck();
        newSampleDeck.push(getRandomSeenCard());
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

    const getRandomSeenCard = () => {
        const randomInt = getRandomInt(0, seenCards.current.length);
        return seenCards.current[randomInt];
    };

    const getRandomUnseenCard = () => {
        return playingDeck.current.find(
            (card) => !seenCards.current.some((seenCard) => seenCard == card)
        );
    };

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        const randomInt = Math.floor(Math.random() * (max - min) + min);
        return randomInt;
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
            stopTimer.current = false;
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
                removeListenersForAd();
                props.route.params.increaseGamesPlayed();
                restartGame();
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
        tintColor.current = goodColor;
        setGameStatus("playing");
        setCardsLeft(props.route.params.deckSize);
        setCurrentTime(0);
        setScore(0);
        stopTimer.current = false;
        prevBestScore.current = bestScore;
    };

    const updateHighscore = () => {
        if (score < bestScore) {
            props.route.params.storeData("timeScore", score.toString());
            setBestScore(score);
            props.route.params.setCurrentTimeScore(score);
        }
    };

    const updateHighscoreLoggedIn = async () => {
        if (bestScore == 0 || score < bestScore) {
            setBestScore(score);
            props.route.params.setCurrentHighscore(score);
            if (props.route.params.getTimeScoresRef()) {
                if (
                    props.route.params.getTimeScoresRef()[
                        props.route.params.getTimeScoresRef().length - 1
                    ].highscore > score
                ) {
                    props.route.params.setTimeScoresRef("empty");
                }
            }

            console.log("beofe");
            let timeScoresFB = [];
            await firebase
                .firestore()
                .collection("highscores")
                .doc("time")
                .get()
                .then(function (doc) {
                    if (doc.exists) {
                        timeScoresFB = Object.entries(doc.data());
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                })
                .catch(function (error) {
                    console.log("Error getting document:", error);
                });
            console.log("after");
            console.log(timeScoresFB);

            if (timeScoresFB.length < 5) {
                await firebase
                    .firestore()
                    .collection("highscores")
                    .doc("time")
                    .update({
                        [props.route.params.loggedInUser.username]: score,
                    });
            } else {
                const lowestUsernameAndScore = timeScoresFB.sort(
                    (a, b) => b[1] - a[1]
                )[0];
                console.log(
                    lowestUsernameAndScore[0],
                    lowestUsernameAndScore[1],
                    score
                );
                if (score < lowestUsernameAndScore[1]) {
                    await firebase
                        .firestore()
                        .collection("highscores")
                        .doc("time")
                        .update({
                            [lowestUsernameAndScore[0]]: firebase.firestore.FieldValue.delete(),
                            [props.route.params.loggedInUser.username]: score,
                        });
                }
            }

            return firebase
                .firestore()
                .collection("users")
                .doc(props.route.params.loggedInUser.id)
                .update({
                    timeScore: score,
                })
                .then(function () {
                    console.log("Document successfully updated!");
                })
                .catch(function (error) {
                    console.error("Error updating document: ", error);
                });
        }
    };

    const handleLeaderBoardPress = () => {
        soundPress();

        props.navigation.navigate("LeaderBoard", {
            loggedInUser: props.route.params.loggedInUser,
            getHighscoresRef: props.route.params.getHighscoresRef,
            getSpeedScoresRef: props.route.params.getSpeedScoresRef,
            getTimeScoresRef: props.route.params.getTimeScoresRef,
            setHighscoresRef: props.route.params.setHighscoresRef,
            setSpeedScoresRef: props.route.params.setSpeedScoresRef,
            setTimeScoresRef: props.route.params.setTimeScoresRef,
            getCurrentHighscoreRank: props.route.params.getCurrentHighscoreRank,
            getCurrentSpeedScoreRank:
                props.route.params.getCurrentSpeedScoreRank,
            getCurrentTimeScoreRank: props.route.params.getCurrentTimeScoreRank,
            setCurrentHighscoreRank: props.route.params.setCurrentHighscoreRank,
            setCurrentSpeedScoreRank:
                props.route.params.setCurrentSpeedScoreRank,
            setCurrentTimeScoreRank: props.route.params.setCurrentTimeScoreRank,
            getCurrentHighscore: props.route.params.getCurrentHighscore,
            getCurrentSpeedScore: props.route.params.getCurrentSpeedScore,
            getCurrentTimeScore: bestScore,
        });
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
                    <Text style={styles.none}>{timerForConfetti()}</Text>
                </ImageBackground>
            ) : (
                <Text style={styles.none}></Text>
            )}
            {gameStatus == "win" && score < prevBestScore.current ? (
                <View style={styles.newBestScore}>
                    <Text style={styles.newBestScoreText}>New Highscore!</Text>
                </View>
            ) : (
                <Text></Text>
            )}

            <View style={styles.scoreBoard}>
                <View style={styles.currentScoreContainer}>
                    <Text style={styles.textTitle}>Current</Text>
                    <Text style={styles.textCurrentScore}>
                        {gameStatus == "win" || gameStatus == "lose"
                            ? fancyTimeFormat(score)
                            : fancyTimeFormat(currentTime)}
                    </Text>
                </View>
                <View style={styles.bestScoreContainer}>
                    <Text style={styles.textTitle}>Best</Text>
                    <Text style={styles.textBestScore}>
                        {fancyTimeFormat(bestScore)}
                    </Text>
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

                            <Text style={styles.reasonText}>
                                Oh no! You've already pressed that.
                            </Text>
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
            {gameStatus == "playing" ? (
                <View style={styles.cardsLeftContainer}>
                    <View style={styles.cardsLeft}>
                        <Text style={styles.cardsLeftText}>Cards</Text>
                        <Text style={styles.cardsLeftNumText}>{cardsLeft}</Text>
                    </View>
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
    newBestScore: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    newBestScoreText: {
        fontSize: 30,
        fontFamily: "nunito-bold",
        color: "#a0c4ff",
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
    none: {
        display: "none",
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
    textTitle: {
        fontSize: 22,
        paddingBottom: 10,
        fontFamily: "nunito-bold",
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
    cardsLeftContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    timer: {
        width: 120,
        paddingVertical: 20,
        borderWidth: 7,
        borderRadius: 20,

        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,

        elevation: 5,
        marginRight: 50,
    },
    timerText: {
        fontSize: 25,
        fontFamily: "nunito-bold",
        textAlign: "center",
    },
    cardsLeft: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    cardsLeftText: {
        fontFamily: "nunito-bold",
        fontSize: 22,
        marginBottom: 10,
    },
    cardsLeftNumText: {
        fontSize: 25,
        fontFamily: "nunito-bold",
        textAlign: "center",
        color: "grey",
    },
    gameEndContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 75,
    },
    gameEndTitle: {
        fontSize: 35,
        fontFamily: "nunito-bold",
        marginBottom: 20,
    },
    reasonText: {
        fontSize: 20,
        width: Dimensions.get("screen").width / 1.2,
        textAlign: "center",
        fontFamily: "nunito-regular",
    },
    buttonsContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
});
