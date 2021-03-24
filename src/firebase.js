// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase"
const firebaseConfig = {
    apiKey: "AIzaSyA1UabtTP6kZXbJNGl_rluaPNKsXdWgpLY",
    authDomain: "whats-clone-1c76b.firebaseapp.com",
    projectId: "whats-clone-1c76b",
    storageBucket: "whats-clone-1c76b.appspot.com",
    messagingSenderId: "792236802080",
    appId: "1:792236802080:web:fbaf12d22ba37ca848fc45",
    measurementId: "G-CE5SGV0ZX5"
  };

firebase.initializeApp(firebaseConfig);
  
const auth=firebase.auth();
const provider=new firebase.auth.GoogleAuthProvider();

export {auth,provider}