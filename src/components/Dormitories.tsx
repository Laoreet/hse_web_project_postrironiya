import React, { useEffect, useState } from 'react';
import { IDormitory, ISlot, IUser, IWM } from '../interfaces';
import { db } from '../lib/firebase';
import { getDatabase, ref, child, get, onValue, off } from "firebase/database";

const Dashboard: React.FC = () => {
  const [dormitories, setDormitories] = useState<IDormitory[]>([]);

  const dbRef = ref(db);

  useEffect(() => {
    const dormitoriesRef = ref(db, 'Dormitories');
    onValue(dormitoriesRef, (snapshot) => {
      const data = snapshot.val();
      const dormitoriesList: IDormitory[] = [];
      for (let id in data) {
        if (data.hasOwnProperty(id)) {
          dormitoriesList.push({ id: Number(id), ...data[id] });
        }
      }
      setDormitories(dormitoriesList);
    });



    return () => {
        off(dormitoriesRef);
    };
  }, []);

  // Render the data here

  return (
    <div className='container'>
      <h1>Общежития</h1>
      {/* Add your UI components to display the data */}
      <div className='dashboard'>
        <h2>Список общежитий</h2>
        <ul>
          {dormitories.map((dormitory) => (
            <li key={dormitory.id}>
              {dormitory.adress}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
