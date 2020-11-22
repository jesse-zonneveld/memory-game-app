import React from "react";
import firebase from "../firebase/config";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as yup from "yup";
import FlatButton from "../shared/flatButton";

const reviewSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required(),
});

export default function LoginForm(props) {
    const loginUser = (values) => {
        firebase
            .auth()
            .signInWithEmailAndPassword(values.email, values.password)
            .then((response) => {
                const uid = response.user.uid;
                const usersRef = firebase.firestore().collection("users");
                usersRef
                    .doc(uid)
                    .get()
                    .then((firestoreDocument) => {
                        if (!firestoreDocument.exists) {
                            alert("User does not exist anymore.");
                            return;
                        }
                        const user = firestoreDocument.data();
                        props.setLoggedInUser(user);
                        props.closeModal();
                    })
                    .catch((error) => {
                        alert(error);
                    });
            })
            .catch((error) => {
                alert(error);
            });
    };

    return (
        <View style={styles.container}>
            <MaterialIcons
                name="close"
                size={24}
                style={styles.exitButton}
                onPress={props.closeModal}
            />
            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={reviewSchema}
                onSubmit={(values, actions) => {
                    console.log(values);
                    loginUser(values);
                    actions.resetForm();
                }}
            >
                {(props) => (
                    <View style={styles.form}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            onChangeText={props.handleChange("email")}
                            returnKeyType="done"
                            value={props.values.email}
                            onBlur={props.handleBlur("email")}
                        />
                        <Text style={styles.errorMessage}>
                            {props.touched.email && props.errors.email}
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            onChangeText={props.handleChange("password")}
                            returnKeyType="done"
                            secureTextEntry={true}
                            value={props.values.password}
                            onBlur={props.handleBlur("password")}
                        />
                        <Text style={styles.errorMessage}>
                            {props.touched.password && props.errors.password}
                        </Text>
                        <FlatButton
                            title="Login"
                            onPress={props.handleSubmit}
                        />
                    </View>
                )}
            </Formik>
            <View style={styles.loginContainer}>
                <Text style={styles.loginSentence}>
                    Don't have an account?{" "}
                    <TouchableOpacity onPress={props.switchModal}>
                        <Text style={styles.loginText}>Register</Text>
                    </TouchableOpacity>
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    exitButton: {
        position: "absolute",
        right: 0,
        top: 20,
        padding: 20,
    },
    form: {
        marginTop: 200,
        paddingHorizontal: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        borderRadius: 6,
        fontSize: 18,
    },
    errorMessage: {
        color: "red",
        fontWeight: "bold",
        marginBottom: 10,
    },
    loginSentence: {
        fontFamily: "nunito-light",
        fontSize: 16,
        marginLeft: 30,
    },
    loginContainer: {
        justifyContent: "center",
    },
    loginText: {
        fontFamily: "nunito-bold",
        fontSize: 16,
        color: "black",
        transform: [{ translateY: 3 }],
    },
});
