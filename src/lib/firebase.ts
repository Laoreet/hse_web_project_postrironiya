// Import the functions you need from the SDKs you need
import { initializeApp} from "firebase/app";
import { getDatabase } from "firebase/database";
import * as firebase from 'firebase/app';
import 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDs7a21lCUKdLZlpGxjGQBzDD2D6eSAGEs",
  authDomain: "postironiya-hse.firebaseapp.com",
  databaseURL: "https://postironiya-hse-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "postironiya-hse",
  storageBucket: "postironiya-hse.appspot.com",
  messagingSenderId: "954760764710",
  appId: "1:954760764710:web:078d54387dec4aeb1135e7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);