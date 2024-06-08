import React, { useEffect, useState } from 'react';
import { IDormitory, ISlot, IUser, IWM } from '../interfaces';
import { db } from '../lib/firebase';
import { getDatabase, ref, child, get, onValue, off } from "firebase/database";

const Dashboard: React.FC = () => {
  const [dormitories, setDormitories] = useState<IDormitory[]>([]);
  const [slots, setSlots] = useState<ISlot[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [wms, setWms] = useState<IWM[]>([]);

  const dbRef = ref(db);

  useEffect(() => {
    const slotsRef = ref(db, 'Slots');
    onValue(slotsRef, (snapshot) => {
      const data = snapshot.val();
      const slotsList: ISlot[] = [];
      for (let id in data) {
        if (data.hasOwnProperty(id)) {
          slotsList.push({ id, ...data[id] });
        }
      }
      setSlots(slotsList);
    });

    return () => {
        off(slotsRef);
    };
  }, []);

  // Render the data here

  return (
    <div className='container'>
      <h1>Слоты</h1>
      <div className='dashboard'>
        <h2>Список слотов</h2>
        <ul>
          {slots.map((slot) => (
            <li key={slot.id}>
              {slot.start} - {slot.user_id} - Стиралка номер {slot.wm_id}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
