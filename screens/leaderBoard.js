import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FlatButton from "../shared/flatButton";

export default function LeaderBoard(props) {
    const handleBackToMenuPress = () => {
        props.navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text>LeaderBoard</Text>
            <FlatButton title="Back to Menu" onPress={handleBackToMenuPress} />
        </View>
    );
}

const styles = StyleSheet.create({});
