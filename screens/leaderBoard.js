import React, { useLayoutEffect, useRef, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
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
    const [highscores, setHighscores] = useState();
    const [currentPosition, setCurrentPosition] = useState();
    const [currentHighscore, setCurrentHighscore] = useState();
    const handleBackToMenuPress = () => {
        props.navigation.navigate("Home");
    };

    const firebaseQuery = async () => {
        const snapshot = await firebase
            .firestore()
            .collection("users")
            .orderBy("highscore", "desc")
            .limit(500)
            .get();

        const data = await snapshot.docs.map((doc, i) => {
            if (props.route.params.loggedInUser) {
                if (props.route.params.loggedInUser.id == doc.data().id) {
                    setCurrentPosition(i + 1);
                    setCurrentHighscore(doc.data().highscore);
                }
            }
            return {
                pos: i + 1,
                username: doc.data().username,
                highscore: doc.data().highscore,
            };
        });

        setHighscores(data);
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
        //                 setCurrentPosition(i);
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
                    {props.route.params.loggedInUser && currentPosition ? (
                        <View style={styles.bottomRow}>
                            <View style={styles.posTextContainer}>
                                <Text style={styles.cellText}>
                                    {currentPosition}.
                                </Text>
                            </View>
                            <View style={styles.usernameTextContainer}>
                                <Text style={styles.cellText}>
                                    {props.route.params.loggedInUser.username}
                                </Text>
                            </View>
                            <View style={styles.currentScoreTextContainer}>
                                <Text style={styles.cellText}>
                                    {currentHighscore}
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <Text></Text>
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
    currentRank: {
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
    flatListContainer: {
        // borderColor: "black",
        // borderWidth: 2,
        flex: 1,
        marginBottom: 15,
        backgroundColor: "#BFFBF7",
        padding: 5,
    },
    leaderBoard: {
        width: Dimensions.get("screen").width / 1.2,
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
        width: Dimensions.get("screen").width / 1.2,
        backgroundColor: "#1DB7F2",
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
    rowLast: {
        flexDirection: "row",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        width: Dimensions.get("screen").width / 1.2,
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
        backgroundColor: "#1D93F2",
    },
    currentScoreTextContainer: {
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F44E90",
    },
    cellText: {
        fontSize: 20,
        fontFamily: "nunito-regular",
    },
    bottomRow: {
        flexDirection: "row",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        // borderBottomColor: "black",
        // borderBottomWidth: 2,
        width: Dimensions.get("screen").width / 1.2,
        backgroundColor: "#F77EAE",
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
