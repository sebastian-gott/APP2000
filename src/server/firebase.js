import firebase from 'firebase/app'
import "firebase/auth"
import "firebase/firestore"
import 'firebase/storage'
const app = firebase.initializeApp({
      apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID
});

const storage = app.storage()

export {storage};

export const auth = app.auth();
export const db = app.firestore();
export default app;
