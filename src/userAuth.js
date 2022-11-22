import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithEmailAndPassword,
    createUserWithEmailAndPassword, sendPasswordResetEmail, signOut} from "firebase/auth";
import {
    getFirestore, query, getDocs, collection, where, addDoc} from "firebase/firestore";

import {auth, db} from "./Firebase.js";

// Creates Google Authetication Provider
const googleProvider = new GoogleAuthProvider();

// Sign in with Google
const signInWithGoogle = async () => {
    try{

        // Gets user info
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;

        // Queries database for user
        // If no user, firebase will create a new user
        const q = query(collection(db, 'users'), where('uid', '==', user.uid));

        // Gets user from database
        const docs = await getDocs(q);
        if (docs.empty) {
            await addDoc(collection(db, 'users'), {
                uid: user.uid,
                email: user.email,
                authProvider: 'google'
            });
        }
    }
    catch(err){
        // If error console log and alert user
        console.log(err);
        alert(err.message);
    }
};

// Sign in with email and password
const loginWithEmailAndPassword = async (email, password) => {
    try{
        // Try to sign in with email and password
        await signInWithEmailAndPassword(auth, email, password);
    }
    catch(err){
        // If error console log and alert user
        console.log(err);
        alert(err.message);
    }
};

// Sign up with email and password
const registerWithEmailAndPassword = async (email, password) => {
    try{
        // Try to sign up with email and password
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;

        // Add user to database
        await addDoc(collection(db, 'users'), {
            uid: user.uid,
            authProvider: 'local',
            email,
        });
    }
    catch(err){
        // If error console log and alert user
        console.log(err);
        alert(err.message);
    }
}

// Send password reset email
const sendPasswordReset = async (email) => {
    try{
        // Try to send password reset email
        await sendPasswordResetEmail(auth, email);
        alert('Password reset email sent!');
    }
    catch(err){
        // If error console log and alert user
        console.log(err);
        alert(err.message);
    }
}

// Sign out
const logout = async () => {
    try{
        // Try to sign out
        await signOut(auth);
    }
    catch(err){
        // If error console log and alert user
        console.log(err);
        alert(err.message);
    }
}

export {
    auth,
    db,
    signInWithGoogle,
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
  };