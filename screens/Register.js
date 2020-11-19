import React, { useRef } from "react";
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

let cachedSnapshot = "empty";
console.log(cachedSnapshot, "---------");
const reviewSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required().min(6),
    username: yup
        .string()
        .required()
        .min(3)
        .max(15)
        .test("unique_username", "Username already taken.", async (val) => {
            console.log(cachedSnapshot == "empty");
            if (cachedSnapshot == "empty") {
                console.log("request made");
                cachedSnapshot = await firebase
                    .firestore()
                    .collection("usernames")
                    .get();
            }

            const usernamesObject = cachedSnapshot.docs.map((doc) =>
                doc.data()
            );
            const usernamesArray = Object.keys(usernamesObject[0]);

            return !usernamesArray.includes(val);
        }),
});

export default function RegisterForm(props) {
    const uid = useRef();
    const registerNewUser = async (values) => {
        await firebase
            .auth()
            .createUserWithEmailAndPassword(values.email, values.password)
            .then((response) => {
                uid.current = response.user.uid;
                const data = {
                    id: uid.current,
                    email: values.email,
                    username: values.username,
                    password: values.password,
                    highscore: 0,
                    speedScore: 0,
                    timeScore: 0,
                };
                const usersRef = firebase.firestore().collection("users");
                usersRef
                    .doc(uid.current)
                    .set(data)
                    .then(() => {
                        firebase
                            .firestore()
                            .collection("usernames")
                            .doc("usernamesDoc")
                            .update({
                                [values.username]: "",
                            })
                            .then(function () {
                                console.log("Document successfully updated!");
                            })
                            .catch(function (error) {
                                console.error(
                                    "Error updating document: ",
                                    error
                                );
                            });
                        cachedSnapshot = "empty";
                        props.setLoggedInUser(data);
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
                onPress={() => {
                    cachedSnapshot = "empty";
                    props.closeModal();
                }}
            />
            <Formik
                initialValues={{ email: "", username: "", password: "" }}
                validationSchema={reviewSchema}
                onSubmit={(values, actions) => {
                    console.log(values);
                    registerNewUser(values);
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
                            placeholder="Username"
                            onChangeText={props.handleChange("username")}
                            returnKeyType="done"
                            value={props.values.username}
                            onBlur={props.handleBlur("username")}
                        />
                        <Text style={styles.errorMessage}>
                            {props.touched.username && props.errors.username}
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            onChangeText={props.handleChange("password")}
                            returnKeyType="done"
                            value={props.values.password}
                            onBlur={props.handleBlur("password")}
                        />
                        <Text style={styles.errorMessage}>
                            {props.touched.password && props.errors.password}
                        </Text>
                        <FlatButton
                            title="create"
                            onPress={props.handleSubmit}
                        />
                    </View>
                )}
            </Formik>
            <View style={styles.loginContainer}>
                <Text style={styles.loginSentence}>
                    Already have an account?{" "}
                    <TouchableOpacity onPress={props.switchModal}>
                        <Text style={styles.loginText}>Login</Text>
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
