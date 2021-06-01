import { goto } from "@roxi/routify";
import firebase from "firebase/app";

export const verifyCurrentUser = async () => {
    if (!firebase.auth().currentUser) {
        console.log(`Unable to authenticate current user, forwarding to home.`);
        $goto("/");
    } else {
        const user = firebase.auth().currentUser;
        const consoleUserProfile = (user) => {
            if (user != null) {
                user.providerData.forEach(function (profile) {
                    console.log(`Sign-in provider: ` + profile.providerId);
                    console.log(`  Provider-specific UID: ` + profile.uid);
                    console.log(`  Name: ` + profile.displayName);
                    console.log(`  Email: ` + profile.email);
                    console.log(`  Photo URL: ` + profile.photoURL);
                });
            }
        };
        consoleUserProfile(user);
    }
};
