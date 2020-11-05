import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import FlatButton from "../shared/flatButton";
import { Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function Game(props) {
    const playingDeck = useRef([]);
    const initialMainDeck = [];
    let initialSampleDeck = [];

    (function initializePlayingDeck() {
        playingDeck.current = [...props.route.params.mainDeck]
            .sort(() => Math.random() - 0.5)
            .slice(0, props.route.params.deckSize);
        initialSampleDeck = playingDeck.current.slice(
            0,
            props.route.params.sampleDeckSize
        );
    })();

    const [sampleDeck, setSampleDeck] = useState(initialSampleDeck);
    const [gameStatus, setGameStatus] = useState("playing");
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(props.route.params.time);
    const seenCards = useRef([]);

    useLayoutEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);
        if (timeLeft < 0) {
            setGameStatus("lose");
        }

        // Clear timeout if the component is unmounted
        return () => clearTimeout(timer);
    }, [timeLeft]);

    const handleExitPress = () => {
        props.navigation.goBack();
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
        if (seenCards.current.some((seenCard) => seenCard.key == card.key)) {
            setGameStatus("lose");
        } else if (seenCards.current.length + 1 == playingDeck.current.length) {
            setGameStatus("win");
        } else {
            setScore(score + 1);
            seenCards.current = [...seenCards.current, card];
            showNewSampleDeck();
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
            console.log(
                !newSampleDeck.some((card) => card.key == nextCard.key)
            );
            if (!newSampleDeck.some((card) => card.key == nextCard.key)) {
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
                    !seenCards.current.some(
                        (seenCard) => seenCard.key == card.key
                    )
            )
        );
        return playingDeck.current.find(
            (card) =>
                !seenCards.current.some((seenCard) => seenCard.key == card.key)
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
        playingDeck.current = mainDeck.current
            .sort(() => Math.random() - 0.5)
            .slice(0, props.route.params.deckSize);

        setSampleDeck(
            playingDeck.current.slice(0, props.route.params.sampleDeckSize)
        );
        seenCards.current = [];
        setScore(0);
        setGameStatus("playing");
        setTimeLeft(5);
    };

    return (
        <View style={styles.container}>
            <MaterialIcons
                name="close"
                size={24}
                style={styles.exitButton}
                onPress={handleExitPress}
            />
            <View>
                <Text>Current Score: {score}</Text>
                <Text>Best Score: xxx</Text>
            </View>
            {gameStatus == "playing" ? (
                <FlatList
                    style={styles.cardsList}
                    numColumns={3}
                    data={sampleDeck}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => handleCardPress(item)}
                        >
                            <Text style={styles.cardText}>{item.key}</Text>
                        </TouchableOpacity>
                    )}
                />
            ) : gameStatus == "lose" ? (
                <View>
                    <Text>Game Over</Text>
                    <Text>Oh no! You've already pressed that.</Text>
                    <FlatButton title="Play Again" onPress={restartGame} />
                    <FlatButton
                        title="View Leader Board"
                        onPress={() => console.log("leaderboard")}
                    />
                    <FlatButton title="Main Menu" onPress={handleExitPress} />
                </View>
            ) : (
                <View>
                    <Text>Congrats! You pressed every icon.</Text>
                    <FlatButton title="Play Again" onPress={restartGame} />
                    <FlatButton
                        title="View Leader Board"
                        onPress={() => console.log("leaderboard")}
                    />
                    <FlatButton title="Main Menu" onPress={handleExitPress} />
                </View>
            )}

            <View style={styles.timer}>
                <Text style={styles.timerText}>
                    {timeLeft >= 0 ? timeLeft : "Times up!"}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        flex: 1,
    },
    exitButton: {
        position: "absolute",
        right: 0,
        top: 20,
        padding: 20,
    },
    cardsList: {
        flex: 1,
        backgroundColor: "#ddd",
        padding: 20,
    },
    card: {
        backgroundColor: "pink",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
        height: Dimensions.get("screen").width / 4,
    },
    timer: {
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "yellow",
    },
    timerText: {
        fontSize: 20,
    },
});
