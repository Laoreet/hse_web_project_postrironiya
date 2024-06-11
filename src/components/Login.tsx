import React, { useState } from 'react'
import { useNavigate} from  'react-router-dom'
import { db } from '../lib/firebase';
import { ref, get } from 'firebase/database';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const navigator = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      // Форматируем email для корректного чтения из базы данных
      const formattedEmail = email.replaceAll(".",",");
      const userRef = ref(db, `Users/${formattedEmail.replace(/\./g, '_')}`);
      const snapshot = await get(userRef);

      if (formattedEmail.includes('edu,hse,ru'))
        {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        console.error(formattedEmail + " Exists! Checking password!");
        if (userData.password === password) {
          // Успешная авторизация
          localStorage.setItem("user", JSON.stringify(userData)); // Сохраняем данные пользователя в localStorage
          navigator("/profile"); // Перенаправляем на страницу профиля
          window.location.reload();
        } else {
          setError("Неверный пароль.");
        }
      } else {
        setError("Пользователь с таким email не найден.");
      }
    } else {
      setError("Вы должны использовать корпоративную почту edu.hse.ru !");
    }
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      setError("Произошла ошибка. Попробуйте позже.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Авторизация</h2>
      {error && <div className="error">{error}</div>}
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
      <button type="submit">Login</button>
    </form>
  )
}

export default Login