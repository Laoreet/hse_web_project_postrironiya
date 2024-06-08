import React, { useEffect, useState } from 'react';
import { IDormitory, ISlot, IUser, IWM } from '../interfaces';
import { db } from '../lib/firebase';
import { getDatabase, ref, child, get, onValue, off } from "firebase/database";

const Dashboard: React.FC = () => {
  const [wms, setWms] = useState<IWM[]>([]);

  const dbRef = ref(db);


  useEffect(() => {
    const wmsRef = ref(db, 'WM');
    onValue(wmsRef, (snapshot) => {
      const data = snapshot.val();
      const wmsList: IWM[] = [];
      for (let id in data) {
        if (data.hasOwnProperty(id)) {
          wmsList.push({ id: Number(id), ...data[id] });
        }
      }
      setWms(wmsList);
    });

    return () => {
        off(wmsRef);
    };
  }, []);

  // Render the data here

  return (
    <div className='container'>
      <h1>Стиральные машины</h1>
      <div className='dashboard'>
        <h2>Список стиральных машин</h2>
        <ul>
          {wms.map((wm) => (
            <li key={wm.id}>
              {wm.dormitory_id} - {wm.floor} - {wm.is_working}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
