import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const githubProvider = new firebase.auth.GithubAuthProvider();
export const fireapp = firebase;
export const firestore = firebase.firestore();
export const firestoreAppName = fireapp.app().name;