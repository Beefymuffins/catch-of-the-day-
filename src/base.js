import Rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';

const firebaseApp = firebase.initializeApp({
    apiKey: 'AIzaSyAEkyYEc2egIqie6NNqJImCDACysE1_L0U',
    authDomain: 'catch-of-the-day-beefy.firebaseapp.com',
    databaseURL: 'https://catch-of-the-day-beefy-default-rtdb.firebaseio.com',
});

const base = Rebase.createClass(firebaseApp.database());

// This is a named export
export { firebaseApp };
// this is a default export
export default base;
