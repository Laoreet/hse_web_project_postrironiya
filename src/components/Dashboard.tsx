import React, { useEffect, useState } from 'react';
import { IDormitory, ISlot, IUser, IWM } from '../interfaces';
import { db } from '../lib/firebase';
import { getDatabase, ref, child, get, onValue, off } from "firebase/database";
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {

  const [user, setUser] = useState<any>(null);
  const navigator = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigator("/login"); // Перенаправляем на страницу авторизации, если пользователь не авторизован
    }
  }, []);

  const [dormitories, setDormitories] = useState<IDormitory[]>([]);
  const [slots, setSlots] = useState<ISlot[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [wms, setWms] = useState<IWM[]>([]);

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

    const usersRef = ref(db, 'Users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const usersList: IUser[] = [];
      for (let id in data) {
        if (data.hasOwnProperty(id)) {
          usersList.push({ id, ...data[id] });
        }
      }
      setUsers(usersList);
    });

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
        off(dormitoriesRef);
        off(slotsRef);
        off(usersRef);
        off(wmsRef);
    };
  }, []);

  // Render the data here

  return (
    <div className='container'>
      <h1>Dashboard</h1>
      {/* Add your UI components to display the data */}
      <div className='dashboard'>
        <h2>Dormitories</h2>
        <ul>
          {dormitories.map((dormitory) => (
            <li key={dormitory.id}>
              {dormitory.adress}
            </li>
          ))}
        </ul>
      </div>
      <div className='dashboard'>
        <h2>Slots</h2>
        <ul>
          {slots.map((slot) => (
            <li key={slot.id}>
              {slot.start} - {slot.user_id} - {slot.wm_id}
            </li>
          ))}
        </ul>
      </div>
      <div className='dashboard'>
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.mail} - {user.dormitory}
            </li>
          ))}
        </ul>
      </div>
      <div className='dashboard'>
        <h2>WM</h2>
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
