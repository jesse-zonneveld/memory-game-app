import React, { useLayoutEffect, useRef, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    Animated,
    TouchableWithoutFeedback,
    Easing,
} from "react-native";
import FlatButton from "../shared/flatButton";
import firebase from "../firebase/config";
import { AppLoading } from "expo";
import { Dimensions } from "react-native";
import trophy from "../assets/images/trophyTeal.jpg";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export default function LeaderBoard(props) {
    const highscoreRef = useRef();
    const speedScoreRef = useRef();
    const timeScoreRef = useRef();
    const [highscores, setHighscores] = useState();
    const [currentHighscoreRank, setCurrentHighscoreRank] = useState();
    const [currentHighscore, setCurrentHighscore] = useState();
    const [currentSpeedScoreRank, setCurrentSpeedScoreRank] = useState();
    const [currentSpeedScore, setCurrentSpeedScore] = useState();
    const [currentTimeScoreRank, setCurrentTimeScoreRank] = useState();
    const [currentTimeScore, setCurrentTimeScore] = useState();
    const handleBackToMenuPress = () => {
        props.navigation.navigate("Home");
    };

    const selectedButton = useRef("normal");

    const [moveAnimation, setMoveAnimation] = useState(
        new Animated.ValueXY({ x: 2, y: 2 })
    );
    const [width, setWidth] = useState(new Animated.Value(95));

    const moveToggle = (x, y) => {
        Animated.timing(moveAnimation, {
            toValue: { x: x, y: y },
            duration: 200,
            easing: Easing.ease,
            useNativeDriver: false,
        }).start();
    };

    const toggleWidth = () => {
        let endWidth = 50;
        if (selectedButton.current == "normal") {
            endWidth = 95;
        } else if (selectedButton.current == "speed") {
            endWidth = 95;
        } else {
            endWidth = 75;
        }

        Animated.timing(width, {
            toValue: endWidth,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
    };

    console.log(props.route.params.loggedInUser.id);

    const firebaseQuery = async () => {
        const userQuery = await firebase
            .firestore()
            .collection("users")
            .doc(props.route.params.loggedInUser.id)
            .get()
            .then(function (doc) {
                if (doc.exists) {
                    setCurrentHighscore(doc.data().highscore);
                    setCurrentSpeedScore(doc.data().speedScore);
                    setCurrentTimeScore(doc.data().timeScore);
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            });

        const highscoreSnapShot = await firebase
            .firestore()
            .collection("users")
            .orderBy("highscore", "desc")
            .limit(100)
            .get();

        const speedScoreSnapShot = await firebase
            .firestore()
            .collection("users")
            .orderBy("speedScore", "desc")
            .limit(100)
            .get();

        const timeScoreSnapShot = await firebase
            .firestore()
            .collection("users")
            .orderBy("timeScore", "desc")
            .limit(100)
            .get();

        const highscoreData = await highscoreSnapShot.docs.map((doc, i) => {
            if (props.route.params.loggedInUser) {
                if (props.route.params.loggedInUser.id == doc.data().id) {
                    setCurrentHighscoreRank(i + 1);
                }
            }
            return {
                pos: i + 1,
                username: doc.data().username,
                highscore: doc.data().highscore,
            };
        });

        const speedScoreData = await speedScoreSnapShot.docs.map((doc, i) => {
            if (props.route.params.loggedInUser) {
                if (props.route.params.loggedInUser.id == doc.data().id) {
                    setCurrentSpeedScoreRank(i + 1);
                }
            }
            return {
                pos: i + 1,
                username: doc.data().username,
                highscore: doc.data().speedScore,
            };
        });

        const timeScoreData = await timeScoreSnapShot.docs.map((doc, i) => {
            if (props.route.params.loggedInUser) {
                if (props.route.params.loggedInUser.id == doc.data().id) {
                    setCurrentTimeScoreRank(i + 1);
                }
            }
            return {
                pos: i + 1,
                username: doc.data().username,
                highscore: doc.data().timeScore,
            };
        });

        highscoreRef.current = highscoreData;
        speedScoreRef.current = speedScoreData;
        timeScoreRef.current = timeScoreData;
        setHighscores(highscoreData);
    };

    useLayoutEffect(() => {
        firebaseQuery();
        // console.log(props.route.params.loggedInUser);
        // firebase
        //     .firestore()
        //     .collection("users")
        //     .orderBy("highscore", "desc")
        //     .limit(500)
        //     .get()
        //     .then(function (querySnapshot) {
        //         const highscoresFromQuery = [];
        //         let i = 1;
        //         querySnapshot.forEach(function (doc) {
        //             // doc.data() is never undefined for query doc snapshots
        //             console.log(doc.data().email, " => ", doc.data().highscore);
        //             highscoresFromQuery.push({
        //                 pos: i,
        //                 email: doc.data().email,
        //                 highscore: doc.data().highscore,
        //             });

        //             if (props.route.params.loggedInUser.id == doc.data().id) {
        //                 console.log("you are at position", i);
        //                 setCurrentHighscoreRank(i);
        //             }
        //             i++;
        //         });
        //         setHighscores(highscoresFromQuery);
        //     });
    }, []);

    if (highscores) {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBackToMenuPress}
                >
                    <FontAwesomeIcon icon={faChevronLeft} size={24} />
                    <Text style={styles.backText}>Menu</Text>
                </TouchableOpacity>

                <Image style={styles.trophy} source={trophy} />
                {/* <Text style={styles.title}>Leaderboard</Text> */}
                <View style={styles.toggleContainer}>
                    <Animated.View
                        style={[
                            styles.toggle,
                            moveAnimation.getLayout(),
                            { width: width },
                        ]}
                    >
                        <Text style={styles.ballButtonText}></Text>
                    </Animated.View>
                    <TouchableWithoutFeedback
                        style={styles.normalToggle}
                        onPress={() => {
                            moveToggle(2, 2);
                            selectedButton.current = "normal";
                            toggleWidth();
                            setHighscores(highscoreRef.current);
                        }}
                    >
                        <Text style={styles.toggleText}>Normal</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        style={styles.speedToggle}
                        onPress={() => {
                            moveToggle(87, 2);
                            selectedButton.current = "speed";
                            toggleWidth();
                            setHighscores(speedScoreRef.current);
                        }}
                    >
                        <Text style={styles.toggleText}>Speed</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        style={styles.timeToggle}
                        onPress={() => {
                            moveToggle(173, 2);
                            selectedButton.current = "time";
                            toggleWidth();
                            setHighscores(timeScoreRef.current);
                        }}
                    >
                        <Text style={styles.toggleText}>Time</Text>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.flatListContainer}>
                    {/* <View style={styles.topRow}>
                        <View style={styles.topRowRankTextContainer}>
                            <Text style={styles.topRowText}>Rank</Text>
                        </View>
                        <View style={styles.topRowUsernameTextContainer}>
                            <Text style={styles.topRowText}>Username</Text>
                        </View>
                        <View style={styles.topRowScoreTextContainer}>
                            <Text style={styles.topRowText}>Score</Text>
                        </View>
                    </View> */}
                    <FlatList
                        contentContainerStyle={styles.leaderBoard}
                        data={highscores}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <View style={styles.row}>
                                <View style={styles.posTextContainer}>
                                    <Text style={styles.cellText}>
                                        {item.pos}.
                                    </Text>
                                </View>
                                <View style={styles.usernameTextContainer}>
                                    <Text style={styles.cellText}>
                                        {item.username}
                                    </Text>
                                </View>
                                <View style={styles.scoreTextContainer}>
                                    <Text style={styles.cellText}>
                                        {item.highscore}
                                    </Text>
                                </View>
                            </View>
                        )}
                    />
                    {props.route.params.loggedInUser ? (
                        <View style={styles.bottomRow}>
                            <View style={styles.posTextContainer}>
                                <Text style={styles.cellText}>
                                    {selectedButton.current == "normal"
                                        ? currentHighscoreRank
                                            ? currentHighscoreRank
                                            : Math.ceil(
                                                  ((highscores[0].highscore -
                                                      highscores[
                                                          highscores.length - 1
                                                      ].highscore) /
                                                      highscores.length) *
                                                      (highscores[
                                                          highscores.length - 1
                                                      ].highscore -
                                                          currentHighscore) +
                                                      highscores.length
                                              )
                                        : selectedButton.current == "speed"
                                        ? currentSpeedScoreRank
                                            ? currentSpeedScoreRank
                                            : Math.ceil(
                                                  ((highscores[0].highscore -
                                                      highscores[
                                                          highscores.length - 1
                                                      ].highscore) /
                                                      highscores.length) *
                                                      (highscores[
                                                          highscores.length - 1
                                                      ].highscore -
                                                          currentHighscore) +
                                                      highscores.length
                                              )
                                        : currentTimeScoreRank
                                        ? currentTimeScoreRank
                                        : Math.ceil(
                                              ((highscores[0].highscore -
                                                  highscores[
                                                      highscores.length - 1
                                                  ].highscore) /
                                                  highscores.length) *
                                                  (highscores[
                                                      highscores.length - 1
                                                  ].highscore -
                                                      currentHighscore) +
                                                  highscores.length
                                          )}
                                    .
                                </Text>
                            </View>
                            <View style={styles.usernameTextContainer}>
                                <Text style={styles.cellText}>
                                    {props.route.params.loggedInUser.username}
                                </Text>
                            </View>
                            <View style={styles.currentScoreTextContainer}>
                                <Text style={styles.cellText}>
                                    {selectedButton.current == "normal"
                                        ? currentHighscore
                                        : selectedButton.current == "speed"
                                        ? currentSpeedScore
                                        : currentTimeScore}
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.bottomRow}>
                            <Text style={styles.cellText}>
                                Register to see your rank
                            </Text>
                        </View>
                    )}
                </View>
                {/* <FlatButton
                    title="Back to Menu"
                    onPress={handleBackToMenuPress}
                /> */}
            </View>
        );
    } else {
        return <AppLoading />;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#1EF1E3",
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
    trophy: {
        marginTop: 30,
        width: 180,
        height: 160,
    },
    title: {
        fontSize: 30,
        textAlign: "center",
        paddingBottom: 30,
        fontWeight: "bold",
    },
    currentHighscoreRank: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        paddingBottom: 20,
    },
    regToSee: {
        textAlign: "center",
        fontSize: 20,
        paddingBottom: 20,
    },
    // topRow: {
    //     height: 50,
    //     justifyContent: "center",
    //     alignItems: "center",
    //     flexDirection: "row",
    //     borderColor: "black",
    //     borderBottomWidth: 2,
    //     backgroundColor: "#1E72F1",
    // },
    // topRowRankTextContainer: {
    //     flex: 1,
    //     borderColor: "black",
    //     borderRightWidth: 2,
    //     height: "100%",
    //     justifyContent: "center",
    //     alignItems: "center",
    // },
    // topRowUsernameTextContainer: {
    //     flex: 2,
    //     borderColor: "black",
    //     height: "100%",
    //     justifyContent: "center",
    //     alignItems: "center",

    //     borderRightWidth: 2,
    // },
    // topRowScoreTextContainer: {
    //     flex: 1,
    //     height: "100%",
    //     justifyContent: "center",
    //     alignItems: "center",
    // },
    // topRowText: {
    //     fontSize: 20,
    //     textAlign: "center",
    //     fontWeight: "bold",
    // },
    // topRowTextLast: {
    //     fontSize: 20,
    //     flex: 1,
    //     textAlign: "center",
    // },
    toggleContainer: {
        flexDirection: "row",
        height: 40,
        backgroundColor: "#BFFBF7",
        justifyContent: "space-around",
        alignItems: "center",
        borderRadius: 20,
        marginBottom: 10,
        width: 250,
        padding: 2,
    },
    toggle: {
        position: "absolute",
        backgroundColor: "#5DCAF6",
        borderRadius: 100,
        // width: "38%",
        height: "100%",
    },
    ballButton: {
        width: "100%",
        height: "100%",
    },
    toggleText: {
        fontSize: 20,
        fontFamily: "nunito-regular",
    },
    flatListContainer: {
        // borderColor: "black",
        // borderWidth: 2,
        flex: 1,
        // marginBottom: 15,
        backgroundColor: "#BFFBF7",
        padding: 5,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    leaderBoard: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    row: {
        flexDirection: "row",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        // borderBottomColor: "black",
        // borderBottomWidth: 2,
        width: "100%",
        backgroundColor: "#DFFDFB",
        marginBottom: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,

        elevation: 5,
    },
    posTextContainer: {
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        // borderColor: "black",
        // borderRightWidth: 2,
    },
    usernameTextContainer: {
        flex: 4,
        height: "100%",
        alignItems: "flex-start",
        justifyContent: "center",
        // borderColor: "black",
        // borderRightWidth: 2,
    },
    scoreTextContainer: {
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#5DCAF6",
    },
    currentScoreTextContainer: {
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F88EB9",
    },
    cellText: {
        fontSize: 20,
        fontFamily: "nunito-regular",
    },
    bottomRow: {
        flexDirection: "row",
        textAlign: "center",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        // borderBottomColor: "black",
        // borderBottomWidth: 2,
        width: "100%",
        backgroundColor: "#FCCFE1",
        marginTop: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,

        elevation: 5,
    },
});
