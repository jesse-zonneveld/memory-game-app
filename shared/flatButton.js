import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faVideo } from "@fortawesome/free-solid-svg-icons";

export default function FlatButton({ title, onPress, withVideo = false }) {
    return (
        <TouchableOpacity onPress={onPress}>
            {withVideo ? (
                <View style={styles.buttonWithVideo}>
                    <Text style={styles.title}>{title}</Text>
                    <View style={styles.icon}>
                        <FontAwesomeIcon
                            icon={faVideo}
                            size={20}
                            color={"white"}
                        />
                    </View>
                </View>
            ) : (
                <View style={styles.button}>
                    <Text style={styles.title}>{title}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 10,
        minWidth: 200,
        backgroundColor: "#f01d71",
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
    buttonWithVideo: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 10,
        minWidth: 200,
        backgroundColor: "#f01d71",
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
    icon: {
        paddingLeft: 10,
    },
});
