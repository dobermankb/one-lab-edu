import firebase from 'firebase/app'
import 'firebase/firestore'

export function loadDB() {
    try {
        var config = {
            apiKey: "AIzaSyBmx8jugvZ_cb4LPGJw0uHkp9zgJwNSrT0",
            authDomain: "onetech-project.firebaseapp.com",
            databaseURL: "https://onetech-project-default-rtdb.firebaseio.com",
            projectId: "onetech-project",
            storageBucket: "onetech-project.appspot.com",
            messagingSenderId: "301793009323",
            appId: "1:301793009323:web:56dc8e89cac113918161ee"
        };
        firebase.initializeApp(config);
    } catch (err) {
        // we skip the "already exists" message which is
        // not an actual error when we're hot-reloading
        if (!/already exists/.test(err.message)) {
            console.error('Firebase initialization error', err.stack);
        }
    }
    return firebase;
}
