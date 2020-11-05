import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Card(props) {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => props.handleCardPress(props.card)}
        >
            <Text style={styles.cardText}>{props.card.key}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "pink",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
        height: Dimensions.get("screen").width / 3.2,
    },
});
