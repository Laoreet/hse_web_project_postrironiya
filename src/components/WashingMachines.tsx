import React, { useEffect, useState } from 'react';
import { IDormitory, ISlot, IUser, IWM } from '../interfaces';
import { db } from '../lib/firebase';
import { getDatabase, ref, child, get, onValue, off } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import { getDormitoryAdressById } from '../lib/firebase-service';

const Dashboard: React.FC = () => {

  const [user, setUser] = useState<any>(null);
  const [adress, setAdress] = useState<string | null>("");
  const [dormitoryMap, setDormitoryMap] = useState<Record<string, string>>({});
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
      setDormitoryMap(dormitoryMap);
    });
    return () => {
      off(dormitoriesRef);
    };
  }, []);

  const [wms, setWms] = useState<IWM[]>([]);
  const [dormitories, setDormitories] = useState<{ [id: number]: IWM[] }>({});

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
              <h2>{dormitoryMap[dormitoryId] || "Не указан"}</h2>
              <ul>
                {dormitories[Number(dormitoryId)].map((wm) => (
                    <li key={wm.id}>
                      <span>Этаж: {wm.floor}</span>
                      <span className={`status ${wm.is_working === 1 ? 'working' : 'not-working'}`}>
                  {wm.is_working === 1 ? 'Работает' : 'Не работает'}
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