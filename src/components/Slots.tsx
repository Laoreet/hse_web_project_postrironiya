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
  const [userNameMap, setUserNameMap] = useState<Record<string, string>>({});
  const [dormitoryMap, setDormitoryMap] = useState<Record<string, string>>({});
  const [floorMap, setFloorMap] = useState<Record<string, string>>({});

  const dbRef = ref(db);

  useEffect(() => {
    const usersRef = ref(db, 'Users');
    onValue(usersRef, (snapshot) => {
      const userData = snapshot.val();
      const usersList: IUser[] = [];
      const userNameMap: { [id: string]: string } = {};
      for (let id in userData) {
        if (userData.hasOwnProperty(id)) {
          usersList.push({ id, ...userData[id] });
          userNameMap[id] = userData[id].first_name; // Store user ID to name mapping
        }
      }
      setUsers(usersList);
      setUserNameMap(userNameMap);
    });

    return () => {
      off(usersRef);
    };
  }, []);

  useEffect(() => {
  const wmsRef = ref(db, 'WM');
  onValue(wmsRef, (snapshot) => {
    const wmsData = snapshot.val();
    const wmsList: IWM[] = [];
    const floorMap: { [id: string]: string } = {};
    for (let id in wmsData) {
      if (wmsData.hasOwnProperty(id)) {
        wmsList.push({ id,...wmsData[id] });
        floorMap[id] = wmsData[id].floor;
      }
    }
    setWms(wmsList);
    setFloorMap(floorMap);
  });
    return () => {
      off(wmsRef);
    };
  }, []);

  useEffect(() => {
    const dormitoriesRef = ref(db, 'Dormitories');
    onValue(dormitoriesRef, (snapshot) => {
      const data = snapshot.val();
      const dormitoriesList: IDormitory[] = [];
      const dormitoryMap: { [id: string]: string } = {};
      for (let id in data) {
        if (data.hasOwnProperty(id)) {
          dormitoriesList.push({ id: Number(id), ...data[id] });
          dormitoryMap[id] = data[id].adress;
        }
      }
      setDormitories(dormitoriesList);
      setDormitoryMap(dormitoryMap);
    });
    return () => {
      off(dormitoriesRef);
    };
  }, []);

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
          <table>
            <caption className="caption-large">Список слотов</caption>
            <thead>
            <tr>
              <th>Время начала</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Email</th>
              <th>Адрес</th>
              <th>Этаж</th>
              <th>Состояние</th>
            </tr>
            </thead>
            <tbody>
            {slots.map((slot, index) => (
                <tr key={slot.id} className={index % 2 === 0 ? 'even' : 'odd'}>
                  <td>{slot.start}</td>
                  <td>{userNameMap[slot.user_id]}</td>
                  <td>{users.find((user) => user.id === slot.user_id)?.last_name}</td>
                  <td>{slot.user_id}</td>
                  <td>{dormitoryMap[slot.wm_id]}</td>
                  <td>{floorMap[slot.wm_id]}</td>
                  <td>{new Date(slot.start) < new Date()? '-' : '✓'}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default Dashboard;
