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
const profanity = [
    "anal",
    "anus",
    "arse",
    "ass",
    "ballsack",
    "balls",
    "bastard",
    "bitch",
    "biatch",
    "bloody",
    "blowjob",
    "blow job",
    "bollock",
    "bollok",
    "boner",
    "boob",
    "bugger",
    "bum",
    "butt",
    "buttplug",
    "clitoris",
    "cock",
    "coon",
    "crap",
    "cunt",
    "damn",
    "dick",
    "dildo",
    "dyke",
    "fag",
    "feck",
    "fellate",
    "fellatio",
    "felching",
    "fuck",
    "fudgepacker",
    "fudge packer",
    "flange",
    "Goddamn",
    "God damn",
    "hell",
    "homo",
    "jerk",
    "jizz",
    "knobend",
    "knobend",
    "labia",
    "lmao",
    "lmfao",
    "muff",
    "nigger",
    "nigga",
    "omg",
    "penis",
    "piss",
    "poop",
    "prick",
    "pube",
    "pussy",
    "queer",
    "scrotum",
    "sex",
    "shit",
    "sh1t",
    "slut",
    "smegma",
    "spunk",
    "tit",
    "tosser",
    "turd",
    "twat",
    "vagina",
    "wank",
    "whore",
    "wtf",
];
const reviewSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required().min(6),
    username: yup
        .string()
        .required()
        .min(3)
        .max(15)
        .test("Spaces_check", "No spaces allowed in username.", (val) => {
            try {
                return !val.includes(" ");
            } catch (err) {
                return false;
            }
        })
        .test(
            "special_char_check",
            "Invalid character '~', '*', '/', '[', or ']'.",
            (val) => {
                try {
                    return (
                        !val.includes("~") &&
                        !val.includes("*") &&
                        !val.includes("/") &&
                        !val.includes("[") &&
                        !val.includes("]")
                    );
                } catch (err) {
                    return false;
                }
            }
        )
        .test("profanity_check", "Inappropriate word used.", (val) => {
            try {
                if (val.length > 2) {
                    return !profanity.some((word) =>
                        val.toLowerCase().includes(word)
                    );
                }
            } catch (err) {
                return false;
            }
        })

        .test("unique_username", "Username already taken.", async (val) => {
            if (cachedSnapshot == "empty") {
                console.log("request made");
                const snapshot = await firebase
                    .firestore()
                    .collection("usernames")
                    .doc("usernamesDoc")
                    .get()
                    .then(function (doc) {
                        if (doc.exists) {
                            console.log(Object.keys(doc.data()));
                            cachedSnapshot = Object.keys(doc.data());
                        } else {
                            console.log("No such document!");
                        }
                    })
                    .catch(function (error) {
                        console.log("Error getting document:", error);
                    });
            }

            try {
                if (val.length > 2) {
                    return !cachedSnapshot.some(
                        (word) => word.toLowerCase() == val.toLowerCase()
                    );
                }
            } catch (err) {
                return false;
            }
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
                            secureTextEntry={true}
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
