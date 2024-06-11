import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../lib/firebase';
import { ref, set, get } from 'firebase/database';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patName, setPatName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dormitory, setDormitory] = useState(1);
  const [error, setError] = useState("");
  const navigator = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    // Форматируем email для корректного сохранения в базе данных
    const formattedEmail = email.replace(/,/g, ".").replaceAll(".",",");
    

    try {
      // Проверяем, что пользователь с таким email еще не зарегистрирован
      const userRef = ref(db, `Users/${formattedEmail}`);
      const snapshot = await get(userRef);
      if (formattedEmail.includes('edu,hse,ru'))
        {
      if (snapshot.exists()) {
        setError("Пользователь с таким email уже зарегистрирован.");
      } else {
        // Сохраняем данные о пользователе в базе данных
        const userData = {
          first_name: firstName,
          last_name: lastName,
          pat_name: patName,
          mail: formattedEmail,
          password: password,
          dormitory: dormitory,
        };
        await set(userRef, userData);

        // Успешная регистрация
        localStorage.setItem("user", JSON.stringify(userData)); // Сохраняем данные пользователя в localStorage
        navigator("/profile"); // Перенаправляем на страницу профиля
        window.location.reload();
      }
    } else {
      setError("Вы должны использовать корпоративную почту edu.hse.ru !");
    }
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      setError("Произошла ошибка. Попробуйте позже.");
    }
  };

  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Регистрация</h2>
      {error && <div className="error">{error}</div>}
      <label>
        Имя:
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Фамилия:
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </label>
      <label>
        Отчество:
        <input
          type="text"
          id="patName"
          value={patName}
          onChange={(e) => setPatName(e.target.value)}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <label>
        Общежитие:
        <select
          id="dormitory"
          value={dormitory}
          onChange={(e) => setDormitory(Number(e.target.value))}
        >
          <option value={1}>Уинская, д. 34</option>
          <option value={2}>Бульвар Гагарина, д. 37А</option>
          <option value={3}>Бульвар Гагарина, д. 41</option>
          </select>
      </label>
      <button type="submit">Register</button>
    </form>
  )
}

export default Register
