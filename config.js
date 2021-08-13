import * as firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyBu3PxMcE4Zsf9bHFspuAsglnl9fPgd2QA",
    authDomain: "willy-app-30a9c.firebaseapp.com",
    projectId: "willy-app-30a9c",
    storageBucket: "willy-app-30a9c.appspot.com",
    messagingSenderId: "491188981538",
    appId: "1:491188981538:web:8197d68abdfdd125a31f7b"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase.firestore();