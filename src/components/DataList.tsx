import { onSnapshot } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { dormitoriesCollection } from '../lib/controller';
import { app, db } from '../lib/firebase';

import { getDatabase, ref, child, get } from "firebase/database";

//import { db } from '../lib/firebase';

function DataList() {
const dbRef = ref(db);

const fetchDormitoriesIdData = async (userId: string) => {
  try {
    const userRef = child(dbRef, `Dormitories/${userId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error(error);
  }
};

fetchDormitoriesIdData("1");

return (
    <div>Писька</div>
);
};

 export default DataList;