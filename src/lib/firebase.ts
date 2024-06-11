// Import the functions you need from the SDKs you need
import { initializeApp} from "firebase/app";
import { getDatabase } from "firebase/database";
import * as firebase from 'firebase/app';
import 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7dGvswtbgtyA9O4ZBwqC0LCSKmDZN7nI",
  authDomain: "wmdatabase-4cb7e.firebaseapp.com",
  databaseURL: "https://wmdatabase-4cb7e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wmdatabase-4cb7e",
  storageBucket: "wmdatabase-4cb7e.appspot.com",
  messagingSenderId: "308701870310",
  appId: "1:308701870310:web:eeccdef48600cca7ace327"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);