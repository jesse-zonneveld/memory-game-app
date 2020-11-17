import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FlatButtonBig({
    title,
    onPress,
    color,
    getGamesPlayed = 0,
}) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.button, { backgroundColor: color }]}>
                <Text style={styles.title}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        paddingVertical: 20,
        paddingHorizontal: 10,
        minWidth: 200,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,

        elevation: 5,
    },
    title: {
        color: "white",
        fontWeight: "bold",
        textTransform: "uppercase",
        fontSize: 16,
        textAlign: "center",
    },
});
