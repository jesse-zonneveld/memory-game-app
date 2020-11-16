import React from "react";
import firebase from "../firebase/config";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as yup from "yup";
import FlatButton from "../shared/flatButton";

const reviewSchema = yup.object({
    email: yup
        .string()
        .email()
        .required()
        .test("unique_email", "Email already being used.", async (val) => {
            const snapshot = await firebase
                .firestore()
                .collection("users")
                .get();
            const emails = snapshot.docs.map((doc) => doc.data().email);
            console.log(emails);
            return !emails.includes(val);
        }),
    password: yup.string().required().min(6),
    username: yup
        .string()
        .required()
        .min(5)
        .max(15)
        .test("unique_username", "Username already taken.", async (val) => {
            const snapshot = await firebase
                .firestore()
                .collection("users")
                .get();
            const usernames = snapshot.docs.map((doc) => doc.data().username);
            console.log(usernames);
            return !usernames.includes(val);
        }),
});

export default function RegisterForm(props) {
    const registerNewUser = (values) => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(values.email, values.password)
            .then((response) => {
                const uid = response.user.uid;
                const data = {
                    id: uid,
                    email: values.email,
                    username: values.username,
                    password: values.password,
                    highscore: 0,
                    speedScore: 0,
                    timeScore: 0,
                };
                const usersRef = firebase.firestore().collection("users");
                usersRef
                    .doc(uid)
                    .set(data)
                    .then(() => {
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
                onPress={props.closeModal}
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
});
