import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyBmx8jugvZ_cb4LPGJw0uHkp9zgJwNSrT0",
    authDomain: "onetech-project.firebaseapp.com",
    databaseURL: "https://onetech-project-default-rtdb.firebaseio.com",
    projectId: "onetech-project",
    storageBucket: "onetech-project.appspot.com",
    messagingSenderId: "301793009323",
    appId: "1:301793009323:web:56dc8e89cac113918161ee"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export default db;