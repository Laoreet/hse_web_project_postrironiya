import React, { useState } from 'react'
import { useNavigate} from  'react-router-dom'
import { db } from '../lib/firebase';
import { ref, get } from 'firebase/database';
import {sha1} from 'crypto-hash';
import { hashed_format } from '../lib/hasher';
import { ForgotPasswordForm } from './ForgotPasswordForm';
//import * as crypto from 'crypto';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const [hash, setHash] = useState("");
  const navigator = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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
        //console.log(hashed_format(password));
        if (userData.password === hashed_format(await sha1(password))) {
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
    <div>
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
      <button type="button" onClick={() => setShowForgotPassword(true)}>
        Забыли пароль?
      </button>
    </form>
      {showForgotPassword && <ForgotPasswordForm />}
    </div>
  )
}

export default Login