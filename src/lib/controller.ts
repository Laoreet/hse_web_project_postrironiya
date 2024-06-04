import { collection, getFirestore } from "firebase/firestore";
import { app, db } from './firebase';
import * as firebase from 'firebase/app';
import 'firebase/database';

export const firestore = getFirestore(app);

// DORMITORIES COLLECTION
export const dormitoriesCollection = collection (firestore, 'Users');