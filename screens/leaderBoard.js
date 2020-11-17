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
import firebase from "../firebase/config";
import { AppLoading } from "expo";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { AdMobInterstitial } from "expo-ads-admob";

export default function LeaderBoard(props) {
    // const highscoresRef = useRef();
    // const speedScoresRef = useRef();
    // const timeScoresRef = useRef();
    const [highscores, setHighscores] = useState();
    // const [currentHighscoreRank, setCurrentHighscoreRank] = useState();
    const [currentHighscore, setCurrentHighscore] = useState();
    // const [currentSpeedScoreRank, setCurrentSpeedScoreRank] = useState();
    const [currentSpeedScore, setCurrentSpeedScore] = useState();
    // const [currentTimeScoreRank, setCurrentTimeScoreRank] = useState();
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

    const firebaseQuery = async () => {
        console.log("inside fire query ===============================");
        let highscoresSnapShot = {};
        let speedScoresSnapShot = {};
        let timeScoresSnapShot = {};

        let prevScore = 999999999;
        let pos = 1;
        let tiedIndex = 1;

        let highscoreData = [];
        let speedScoreData = [];
        let timeScoreData = [];

        if (props.route.params.loggedInUser) {
            await firebase
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
        }
        console.log("after user loggin~~~~~~~~~~~~~~~");

        if (props.route.params.getHighscoresRef() == "empty") {
            console.log(
                "making highscore query ==============================="
            );

            highscoresSnapShot = await firebase
                .firestore()
                .collection("users")
                .where("highscore", ">", 0)
                .orderBy("highscore", "desc")
                .limit(10)
                .get();

            highscoreData = await highscoresSnapShot.docs.map((doc, i) => {
                const highscore = doc.data().highscore;
                let rank = 0;

                if (highscore < prevScore) {
                    rank = pos;
                    tiedIndex = rank;
                    pos++;
                } else {
                    rank = tiedIndex;
                    if (pos == 1) pos = 2;
                }
                prevScore = highscore;

                if (props.route.params.loggedInUser) {
                    if (props.route.params.loggedInUser.id == doc.data().id) {
                        props.route.params.setCurrentHighscoreRank(rank);
                    }
                }
                return {
                    pos: rank,
                    username: doc.data().username,
                    highscore: highscore,
                };
            });

            props.route.params.setHighscoresRef(highscoreData);
        }

        if (props.route.params.getSpeedScoresRef() == "empty") {
            console.log(
                "making speedscore query ==============================="
            );
            speedScoresSnapShot = await firebase
                .firestore()
                .collection("users")
                .where("speedScore", ">", 0)
                .orderBy("speedScore", "desc")
                .limit(10)
                .get();

            prevScore = 999999999;
            pos = 1;
            tiedIndex = 1;

            speedScoreData = await speedScoresSnapShot.docs.map((doc) => {
                const highscore = doc.data().speedScore;
                let rank = 0;
                if (highscore < prevScore) {
                    rank = pos;
                    tiedIndex = rank;
                    pos++;
                } else {
                    rank = tiedIndex;
                    if (pos == 1) pos = 2;
                }
                prevScore = highscore;

                if (props.route.params.loggedInUser) {
                    if (props.route.params.loggedInUser.id == doc.data().id) {
                        props.route.params.setCurrentSpeedScoreRank(rank);
                    }
                }
                return {
                    pos: rank,
                    username: doc.data().username,
                    highscore: doc.data().speedScore,
                };
            });

            props.route.params.setSpeedScoresRef(speedScoreData);
        }

        if (props.route.params.getTimeScoresRef() == "empty") {
            console.log(
                "making timescore query ==============================="
            );
            timeScoresSnapShot = await firebase
                .firestore()
                .collection("users")
                .where("timeScore", ">", 0)
                .orderBy("timeScore")
                .limit(10)
                .get();

            prevScore = 0;
            pos = 1;
            tiedIndex = 1;

            timeScoreData = await timeScoresSnapShot.docs.map((doc) => {
                const highscore = doc.data().timeScore;
                let rank = 0;
                if (highscore > prevScore) {
                    rank = pos;
                    tiedIndex = rank;
                    pos++;
                } else {
                    rank = tiedIndex;
                    if (pos == 1) pos = 2;
                }
                prevScore = highscore;

                if (props.route.params.loggedInUser) {
                    if (props.route.params.loggedInUser.id == doc.data().id) {
                        props.route.params.setCurrentTimeScoreRank(rank);
                    }
                }
                return {
                    pos: rank,
                    username: doc.data().username,
                    highscore: doc.data().timeScore,
                };
            });
            props.route.params.setTimeScoresRef(timeScoreData);
        }

        // highscoresRef.current = highscoreData;
        // speedScoresRef.current = speedScoreData;
        // timeScoresRef.current = timeScoreData;
        console.log("end of query");
        setHighscores(props.route.params.getHighscoresRef());
    };

    useLayoutEffect(() => {
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
        AdMobInterstitial.addEventListener("interstitialDidClose", () =>
            console.log("close")
        );
        AdMobInterstitial.removeAllListeners();
        showVideoAd();
        firebaseQuery();
    }, []);

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

    const showVideoAd = async () => {
        await AdMobInterstitial.setAdUnitID(
            "ca-app-pub-3940256099942544/5135589807" // test
        );
        await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
        await AdMobInterstitial.showAdAsync();
    };

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

                <Image
                    style={styles.trophy}
                    source={require("../assets/images/trophyTeal.jpg")}
                />
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
                            setHighscores(
                                props.route.params.getHighscoresRef()
                            );
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
                            setHighscores(
                                props.route.params.getSpeedScoresRef()
                            );
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
                            setHighscores(
                                props.route.params.getTimeScoresRef()
                            );
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
                                        {selectedButton.current == "time"
                                            ? fancyTimeFormat(item.highscore)
                                            : item.highscore}
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
                                        ? currentHighscore == 0
                                            ? "NA"
                                            : props.route.params.getCurrentHighscoreRank()
                                            ? props.route.params.getCurrentHighscoreRank()
                                            : Math.ceil(
                                                  ((highscores[0].highscore -
                                                      highscores[
                                                          highscores.length - 1
                                                      ].highscore) /
                                                      highscores[
                                                          highscores.length - 1
                                                      ].pos) *
                                                      (highscores[
                                                          highscores.length - 1
                                                      ].highscore -
                                                          currentHighscore) +
                                                      highscores[
                                                          highscores.length - 1
                                                      ].pos
                                              )
                                        : selectedButton.current == "speed"
                                        ? currentSpeedScore == 0
                                            ? "NA"
                                            : props.route.params.getCurrentSpeedScoreRank()
                                            ? props.route.params.getCurrentSpeedScoreRank()
                                            : Math.ceil(
                                                  ((highscores[0].highscore -
                                                      highscores[
                                                          highscores.length - 1
                                                      ].highscore) /
                                                      highscores[
                                                          highscores.length - 1
                                                      ].pos) *
                                                      (highscores[
                                                          highscores.length - 1
                                                      ].highscore -
                                                          currentSpeedScore) +
                                                      highscores[
                                                          highscores.length - 1
                                                      ].pos
                                              )
                                        : currentTimeScore == 0
                                        ? "NA"
                                        : props.route.params.getCurrentTimeScoreRank()
                                        ? props.route.params.getCurrentTimeScoreRank()
                                        : Math.ceil(
                                              ((highscores[
                                                  highscores.length - 1
                                              ].highscore -
                                                  highscores[0].highscore) /
                                                  highscores[
                                                      highscores.length - 1
                                                  ].pos) *
                                                  currentTimeScore -
                                                  highscores[
                                                      highscores.length - 1
                                                  ].highscore +
                                                  highscores[
                                                      highscores.length - 1
                                                  ].pos
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
                                        : fancyTimeFormat(currentTimeScore)}
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
