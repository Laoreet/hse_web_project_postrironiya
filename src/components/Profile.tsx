import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../lib/firebase';
import { getDatabase, ref, child, get, onValue, off, update} from "firebase/database";
import { IDormitory } from '../interfaces';
import { getDormitoryAdressById } from '../lib/firebase-service';


function Profile() {
  const [user, setUser] = useState<any>(null);
  const navigator = useNavigate();
  const [adress, setAdress] = useState<string | null>("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordChangeForm, setShowPasswordChangeForm] = useState(false);


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
  
  const handleShowPasswordChangeForm = () => {
    setShowPasswordChangeForm(!showPasswordChangeForm);
  };

  const handlePasswordChange = async () => {
    if (newPassword!== confirmNewPassword) {
      setPasswordError("Новые пароли не совпадают.");
      return;
    }

    try {
      const userRef = ref(db, `Users/${user.mail.replaceAll('.', ',')}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.password!== currentPassword) {
          setPasswordError("Текущий пароль неверен.");
          return;
        }

        await update(userRef, { password: newPassword });
        setPasswordError("Пароль успешно изменен.");
      } else {
        setPasswordError("Ошибка изменения пароля.");
      }
    } catch (error) {
      console.error("Ошибка изменения пароля:", error);
      setPasswordError("Ошибка изменения пароля.");
    }
  };


  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
        <h2 className="profile-name">Профиль</h2>
        <p className="profile-info">Имя: {user.first_name}</p>
        <p className="profile-info">Фамилия: {user.last_name}</p>
        <p className="profile-info">Отчество: {user.pat_name || "Не указано"}</p>
        <p className="profile-info">Email: {user.mail.replaceAll(',','.')}</p>
        <p className="profile-info">Общежитие: {adress || "Не указано"}</p>
        <button className="logout-button" onClick={handleLogout}>Выход</button>

        <button className='change-pass-button' onClick={handleShowPasswordChangeForm}>Сменить пароль</button>

    {showPasswordChangeForm && (
      <form>
        <label>
          Текущий пароль:
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>
        <label>
          Новый пароль:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <label>
          Подтвердите новый пароль:
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </label>
        {passwordError && <div className="error">{passwordError}</div>}
        <button className='logout-button' onClick={handlePasswordChange}>Сменить пароль</button>
      </form>
    )}
    </div>

  )
}

export default Profile
