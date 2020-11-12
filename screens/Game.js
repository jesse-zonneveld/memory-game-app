import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import FlatButton from "../shared/flatButton";
import { Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import firebase from "../firebase/config";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { AnimatedCircularProgress } from "react-native-circular-progress";

export default function Game(props) {
    const playingDeck = useRef(
        [...props.route.params.mainDeck]
            .sort(() => Math.random() - 0.5)
            .slice(0, props.route.params.deckSize)
    );
    // let initialSampleDeck = [];

    // (function initializePlayingDeck() {
    //     console.log("initinaliziing");
    //     playingDeck.current = [...props.route.params.mainDeck]
    //         .sort(() => Math.random() - 0.5)
    //         .slice(0, props.route.params.deckSize);
    //     initialSampleDeck = playingDeck.current.slice(
    //         0,
    //         props.route.params.sampleDeckSize
    //     );
    // })();

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
            if (props.route.params.loggedInUser) {
                updateHighscore();
            }
        }
    }, [gameStatus]);

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
        props.navigation.navigate("Home");
    };

    const handleCardPress = (card) => {
        console.log("inside handle -------------------------");
        updateGameStatus(card);
    };

    const updateGameStatus = (card) => {
        console.log("inside update gameStatus -------------------------");
        console.log(card);
        console.log("seencards -------------");
        console.log(seenCards.current);
        console.log(
            seenCards.current.some((seenCard) => seenCard.key == card.key)
        );
        if (seenCards.current.some((seenCard) => seenCard == card)) {
            stopTimer.current = true;
            setGameStatus("lose");
        } else if (seenCards.current.length + 1 == playingDeck.current.length) {
            setScore(score + 1);
            stopTimer.current = true;
            setGameStatus("win");
        } else {
            setScore(score + 1);
            seenCards.current = [...seenCards.current, card];
            showNewSampleDeck();
            tintColor.current = "#72F11E";
            setTimeLeft(props.route.params.time);
        }
    };

    const showNewSampleDeck = () => {
        console.log("inside showNewSampleDeck -------------------------");

        const newSampleDeck = [];
        shufflePlayingDeck();
        newSampleDeck.push(getRandomSeenCard());
        newSampleDeck.push(getRandomUnseenCard());

        let i = 0;
        while (newSampleDeck.length < props.route.params.sampleDeckSize) {
            const nextCard = playingDeck.current[i];
            console.log(nextCard);
            console.log(!newSampleDeck.some((card) => card == nextCard));
            if (!newSampleDeck.some((card) => card == nextCard)) {
                newSampleDeck.push(nextCard);
                console.log("added");
            } else {
                console.log("skipped");
            }
            i++;
        }
        setSampleDeck(newSampleDeck.sort(() => Math.random() - 0.5));
    };

    const getRandomSeenCard = () => {
        const randomInt = getRandomInt(0, seenCards.current.length);
        console.log("seenCards.current-----------------------------------");
        console.log(seenCards.current);

        console.log("randomSeenCard-----------------------------------");
        console.log(seenCards.current[randomInt]);
        return seenCards.current[randomInt];
    };

    const getRandomUnseenCard = () => {
        console.log("randomUnseenCard-----------------------------------");
        console.log(
            playingDeck.current.find(
                (card) =>
                    !seenCards.current.some((seenCard) => seenCard == card)
            )
        );
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
        console.log("inside shuffle deck-----------------------------------");

        playingDeck.current = [...playingDeck.current].sort(
            () => Math.random() - 0.5
        );
    };

    const restartGame = () => {
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
            setBestScore(score);
            props.route.params.setCurrentHighscore(score);
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
        }
    };

    const handleLeaderBoardPress = () => {
        props.navigation.navigate("LeaderBoard", {
            loggedInUser: props.route.params.loggedInUser,
        });
    };

    return (
        <View style={styles.container}>
            <MaterialIcons
                name="close"
                size={24}
                style={styles.exitButton}
                onPress={handleExitPress}
            />
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
                        <FlatButton title="Play Again" onPress={restartGame} />
                        <FlatButton
                            title="Leader Board"
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

            {/* <View style={styles.timer}>
                <Text style={styles.timerText}>
                    {timeLeft >= 0 ? timeLeft : "Times up!"}
                </Text>
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FCFEEF",
        paddingTop: 50,
        flex: 1,
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
        marginBottom: 40,
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
    },
});
