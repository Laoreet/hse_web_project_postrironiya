import React, { useEffect, useState } from 'react';
import { IDormitory, ISlot, IUser, IWM } from '../interfaces';
import { db } from '../lib/firebase';
import { getDatabase, ref, child, get, onValue, off, update } from "firebase/database";
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
      getDormitoryAdressById(Number(userData.dormitory)).then((adress) => {
        setAdress(adress);
      });
    } else {
      navigator("/login"); // Перенаправляем на страницу авторизации, если пользователь не авторизован
    }

  }, []);

  const [wms, setWms] = useState<IWM[]>([]);
  const [dormitories, setDormitories] = useState<{ [id: number]: IWM[] }>({});

  const dbRef = ref(db);

  function toggleWorking(id: Number, working: Boolean): void {
    const machineRef = ref(db, `WM/${id}`);
    update(machineRef, { is_working: Number(!working) });
  }

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

      const dormitoriesObj: { [id: number]: IWM[] } = {};
      wmsList.forEach((wm) => {
        if (!dormitoriesObj[wm.dormitory_id]) {
          dormitoriesObj[wm.dormitory_id] = [];
        }
        dormitoriesObj[wm.dormitory_id].push(wm);
      });
      setDormitories(dormitoriesObj);
    });

    return () => {
        off(wmsRef);
    };
  }, []);

  return (
    <div className="WMList">
      <h1>Список стиральных машин</h1>
      {Object.keys(dormitories).map((dormitoryId) => (
        <div key={dormitoryId}>
          <h2>{adress || "Не указан"}</h2>
          <ul>
            {dormitories[Number(dormitoryId)].map((wm) => (
              <li key={wm.id}>
                <span>Этаж: {wm.floor}</span>
                <span className={`status ${wm.is_working === 1 ? 'working' : 'not-working'}`}>
                  {wm.is_working === 1 ? 'Работает' : 'Не работает'}
                </span>
                <span>
                  {user['status'] === 'admin' && (
                    <button
                    type="button" 
                    style={{ background: '#aac4eb', border: 'none', borderRadius: '5px', marginLeft: '50px' }}
                    onClick={ (e) => {
                      toggleWorking(wm.id, Boolean(wm.is_working));
                    }
                    }
                    >
                    {wm.is_working === 1 ? 'Отключить' : 'Включить'}</button>)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;