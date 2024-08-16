import serviceAccount from "../config/serviceAccountKey.json" assert { type: "json" };
import admin from "firebase-admin";

// const credential = admin.credential.applicationDefault()
const credential = admin.credential.cert(serviceAccount);

let firebaseAdmin = null;

export const getFirebaseAdmin = () => {
    if (!firebaseAdmin) {
        admin.initializeApp({
            credential,
        });

        firebaseAdmin = true;
    }
    return admin;
};

export const getMessaging = () => {
    return getFirebaseAdmin().messaging();
};
