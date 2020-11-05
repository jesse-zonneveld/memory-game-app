import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import Card from "../shared/card";
import FlatButton from "../shared/flatButton";
import { Dimensions } from "react-native";

export default function Sandbox(props) {
    const handleExitPress = () => {
        props.navigation.goBack();
    };
    return (
        <View style={styles.container}>
            <FlatList
                contentContainerStyle={styles.cardsList}
                numColumns={3}
                data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card}>
                        <Text>{item}</Text>
                    </TouchableOpacity>
                )}
            />
            <FlatButton title="Exit" onPress={handleExitPress} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        flex: 1,
        backgroundColor: "green",
    },
    cardsList: {
        flex: 1,
        backgroundColor: "yellow",
    },
    card: {
        backgroundColor: "#ddd",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
        height: Dimensions.get("screen").width / 3.2,
    },
});
