import React, { useEffect, useState } from 'react';
import { IDormitory, ISlot, IUser, IWM } from '../interfaces';
import { db } from '../lib/firebase';
import { getDatabase, ref, child, get, onValue, off } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import { getDormitoryAdressById } from '../lib/firebase-service';

const Dashboard: React.FC = () => {

  const [user, setUser] = useState<any>(null);
  const [adress, setAdress] = useState<string | null>("");
  const navigator = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
        setUser(userData);
      getDormitoryAdressById(userData.dormitory).then((adress) => {
        setAdress(adress);
      });
    } else {
      navigator("/login"); // Перенаправляем на страницу авторизации, если пользователь не авторизован
    }
  }, []);

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
              {adress || "Не указано"} - Этаж {wm.floor} - {Boolean(wm.is_working) ? 'Работает' : 'Не работает'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
