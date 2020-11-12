import * as firebase from "firebase";
import "@firebase/auth";
import "@firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAFN2R12EPx6aLUKOnaxrf0bi8FWgCrU0s",
    authDomain: "memory-game-app-6b0a2.firebaseapp.com",
    databaseURL: "https://memory-game-app-6b0a2.firebaseio.com",
    projectId: "memory-game-app-6b0a2",
    storageBucket: "memory-game-app-6b0a2.appspot.com",
    messagingSenderId: "650175915806",
    appId: "1:650175915806:ios:ac3c6203b70395ae0f0b0f",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
