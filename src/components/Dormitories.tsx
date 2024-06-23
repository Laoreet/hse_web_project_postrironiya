import React, { useState, useEffect } from 'react';
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
  const [students, setStudents] = useState<IUser[]>([]);
  const [selectedDormitory, setSelectedDormitory] = useState<IDormitory | null>(null);

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

    const studentsRef = ref(db, 'Users');
    onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      const studentsList: IUser[] = [];
      for (let id in data) {
        if (data.hasOwnProperty(id)) {
          studentsList.push({ id: Number(id), ...data[id] });
        }
      }
      setStudents(studentsList);
    });

    return () => {
      off(dormitoriesRef);
      off(studentsRef);
    };
  }, []);

  const [showStudents, setShowStudents] = useState(false);

  const handleDormitoryClick = (dormitory: IDormitory) => {
    if (selectedDormitory && selectedDormitory.id === dormitory.id) {
      setShowStudents(false);
    }
    setSelectedDormitory(dormitory);
    if (!showStudents) {
      setShowStudents(true);
    }
  };

  return (
      <div className='container'>
        <h1>Общежития</h1>
        <div className='dashboard'>
          <h2>Список общежитий</h2>
          <ul>
            {dormitories.map((dormitory) => (
                <li key={dormitory.id} onClick={() => handleDormitoryClick(dormitory)}>
                  {dormitory.adress}
                </li>
            ))}
          </ul>
          {showStudents && selectedDormitory && (
              <div>
                <h2>Список студентов в общежитии {selectedDormitory.adress}</h2>
                <ul>
                  {students.filter((student) => student.dormitory === selectedDormitory.id).map((student) => (
                      <li key={student.id}>{student.last_name} {student.first_name}</li>
                  ))}
                </ul>
              </div>
          )}
        </div>
      </div>
  );
};

export default Dashboard;