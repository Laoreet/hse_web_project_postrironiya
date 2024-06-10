import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../lib/firebase';
import { ref, set, get } from 'firebase/database';
import emailjs from '@emailjs/browser';
import apiKey from '../lib/emailkey';


function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patName, setPatName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dormitory, setDormitory] = useState(1);
  const [error, setError] = useState("");
  const [verificationCode, setVerificationCode] = useState('');
  const [userCode, setUserCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const navigator = useNavigate();

  useEffect(() => emailjs.init(apiKey.PUBLIC_KEY), [])

  const sendVerificationCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const formattedEmail = email.replace(/,/g, ".").replaceAll(".",",");

    if (!formattedEmail.includes('edu,hse,ru')) {
      setError("Вы должны использовать корпоративную почту edu.hse.ru !");
      return;
    }

    try {
      // Проверяем, что пользователь с таким email еще не зарегистрирован
      const userRef = ref(db, `Users/${formattedEmail}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        setError("Пользователь с таким email уже зарегистрирован.");
      } else {
        // Генерируем код подтверждения и сохраняем его в базе данных
        const code = Math.floor(100000 + Math.random() * 900000);
        setVerificationCode(String(code));

        await emailjs.send(
          apiKey.SERVICE_ID,
        apiKey.TEMPLATE_ID,
          {
            email: email,
            code: String(code),
          }
        ).then((response) => {
          console.log('Email sent successfuly!', response)
        }).catch((error) => {
          console.error('Error sending email:', error)
        })

        setCodeSent(true);
      }
    } catch (error) {
      console.error("Ошибка отправки кода подтверждения:", error);
      setError("Произошла ошибка. Попробуйте позже.");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    // Форматируем email для корректного сохранения в базе данных
    const formattedEmail = email.replace(/,/g, ".").replaceAll(".",",");

    if (!firstName || !lastName || !patName) {
      setError("Пожалуйста, заполните все поля: Имя, Фамилия.");
      return;
    }
    
    if (userCode !== verificationCode) {
      setError("Неверный код подтверждения.");
      return;
    }

    try {
      // Проверяем, что пользователь с таким email еще не зарегистрирован
      const userRef = ref(db, `Users/${formattedEmail}`);
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
      catch (error) {
      console.error("Ошибка регистрации:", error);
      setError("Произошла ошибка. Попробуйте позже.");
    }
  };

  
  return (
    <div>
      {!codeSent && (
        <form onSubmit={sendVerificationCode}>
          <h2>Регистрация</h2>
          {error && <div className="error">{error}</div>}
          <label>
            Адрес электронной почты:
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <button type="submit">Отправить код подтверждения</button>
        </form>
      )}
      {codeSent && (
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
              required
            />
          </label>
          <label>
            Фамилия:
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
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
            Пароль:
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
          <label>
            Код подтверждения:
            <input
              type="text"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
            />
          </label>
          <button type="submit">Завершить регистрацию</button>
        </form>
      )}
    </div>
  )
}

export default Register
