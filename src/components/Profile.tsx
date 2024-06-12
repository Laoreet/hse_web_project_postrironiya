import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../lib/firebase';
import { getDatabase, ref, child, get, onValue, off, update} from "firebase/database";
import { IDormitory } from '../interfaces';
import { getDormitoryAdressById } from '../lib/firebase-service';
import { PencilSquare, Check, X } from 'react-bootstrap-icons'


function Profile() {
  const [user, setUser] = useState<any>(null);
  const navigator = useNavigate();
  const [adress, setAdress] = useState<string | null>("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordChangeForm, setShowPasswordChangeForm] = useState(false);

  const [editedUser, setEditedUser] = useState<any>(null);
  const [editedAdress, setEditedAdress] = useState<any>(null);

  const [showEditFirstName, setShowEditFirstName] = useState(false);
  const [showEditLastName, setShowEditLastName] = useState(false);
  const [showEditPatName, setShowEditPatName] = useState(false);
  const [showEditDormitory, setShowEditDormitory] = useState(false);


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setEditedUser(userData);
        console.log('Загружаю общагу номер ', userData.dormitory);
      getDormitoryAdressById(Number(userData.dormitory)).then((adress) => {
        console.log(adress);
        setAdress(adress);
        setEditedAdress(adress);
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

  const handleSaveChange = async (field: keyof typeof user) => {
    if (field === 'first_name' || field === 'last_name') {
      if (!editedUser[field].trim()) {
        alert('Имя и Фамилия не могут быть пустыми');
        return;
      }
    }
    try {
      const userRef = ref(db, `Users/${user.mail.replaceAll('.', ',')}`);
      editedUser['dormitory'] = Number(editedUser['dormitory']);
      await update(userRef, {[field]: editedUser[field]});
      //alert("Изменения сохранены успешно!");
      user[field] = editedUser[field];
      //user['dormitory'] = Number(user['dormitory']);
      setUser({...user, [field]: editedUser[field]});
      console.log(field, user[field]);
      //setUser({...user, 'dormitory':editedUser.dormitory});
      localStorage.setItem("user", JSON.stringify(user));
      //setEditedUser(user);
      setAdress(editedAdress);
    } catch (error) {
      console.error("Ошибка сохранения изменений:", error);
      alert("Ошибка сохранения изменений. Пожалуйста, попробуйте снова.");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-name">Профиль</h2>
      <p className="profile-info">
        Имя: {user.first_name}
        <PencilSquare onClick={() => setShowEditFirstName(true)} />
        {showEditFirstName && (
          <input
            type="text"
            value={editedUser.first_name}
            onChange={(e) => setEditedUser({ ...editedUser, first_name: e.target.value })}
            required
          />
        )}
        {showEditFirstName && (
          <div>
            <Check onClick={() => {handleSaveChange('first_name');
            setShowEditFirstName(false);
            }} />
            <X onClick={() => setShowEditFirstName(false)} />
          </div>
        )}
      </p>

      <p className="profile-info">
        Фамилия: {user.last_name}
        <PencilSquare onClick={() => setShowEditLastName(true)} />
        {showEditLastName && (
          <input
            type="text"
            value={editedUser.last_name}
            onChange={(e) => setEditedUser({ ...editedUser, last_name: e.target.value })}
            required
          />
        )}
        {showEditLastName && (
          <div>
            <Check onClick={() => {handleSaveChange('last_name');
              setShowEditLastName(false);
            }} />
            <X onClick={() => setShowEditLastName(false)} />
          </div>
        )}
      </p>

      <p className="profile-info">
        Отчество: {user.pat_name || "Не указано"}
        <PencilSquare onClick={() => setShowEditPatName(true)} />
        {showEditPatName && (
          <input
            type="text"
            value={editedUser.pat_name}
            onChange={(e) => setEditedUser({ ...editedUser, pat_name: String(e.target.value) })}
          />
        )}
        {showEditPatName && (
          <div>
            <Check onClick={() => {handleSaveChange('pat_name');
              setShowEditPatName(false);
            }} />
            <X onClick={() => setShowEditPatName(false)} />
          </div>
        )}
      </p>

      <p className="profile-info">
        Общежитие: {adress || "Не указано"}
        <PencilSquare onClick={() => setShowEditDormitory(true)} />
        {showEditDormitory && (
          <select
            value={editedUser.dormitory}
            onChange={(e) => {
            editedUser.dormitory = e.target.value;
            getDormitoryAdressById(Number(e.target.value)).then((adress) => {
              setEditedAdress(adress);
            });
            console.log('Выбрал: ', e.target.value, 'В editedUser: ', editedUser.dormitory);
          }}
          >
            <option value={1}>Уинская, д. 34</option>
            <option value={2}>Бульвар Гагарина, д. 37А</option>
            <option value={3}>Бульвар Гагарина, д. 41</option>
          </select>
        )}
        {showEditDormitory && (
          <div>
            <Check onClick={() => {handleSaveChange('dormitory');
              setShowEditDormitory(false);
            }} />
            <X onClick={() => setShowEditDormitory(false)} />
          </div>
        )}
      </p>
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
