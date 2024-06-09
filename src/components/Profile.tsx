import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../lib/firebase';
import { getDatabase, ref, child, get, onValue, off } from "firebase/database";
import { IDormitory } from '../interfaces';
import { getDormitoryAdressById } from '../lib/firebase-service';


function Profile() {
  const [user, setUser] = useState<any>(null);
  const navigator = useNavigate();
  const [adress, setAdress] = useState<string | null>("");

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

  const handleLogout = () => {
    localStorage.removeItem("user"); // Удаляем данные о пользователе из localStorage
    navigator("/login"); // Перенаправляем на страницу авторизации
    window.location.reload();
  };


  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
        <h2 className="profile-name">Профиль</h2>
        <p className="profile-info">Имя: {user.first_name}</p>
        <p className="profile-info">Фамилия: {user.last_name}</p>
        <p className="profile-info">Отчество: {user.pat_name}</p>
        <p className="profile-info">Email: {user.mail}</p>
        <p className="profile-info">Общежитие: {adress || "Не указано"}</p>
        <button className="logout-button" onClick={handleLogout}>Выход</button>
    </div>

  )
}

export default Profile
