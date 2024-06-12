import emailjs from '@emailjs/browser';
import apiKey from '../lib/emailkey';
import { db } from '../lib/firebase';
import { getDatabase, ref, child, get, onValue, off, update, set} from "firebase/database";
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { hashed_format } from '../lib/hasher';
import { sha1 } from 'crypto-hash';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userCode, setUserCode] = useState('');
  

  useEffect(() => emailjs.init(apiKey.PUBLIC_KEY), []);

  const handleSendCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    // Проверяем, что пользователь с таким email зарегистрирован
    const formattedEmail = email.replace(/,/g, ".").replaceAll(".",",");
    const userRef = ref(db, `Users/${formattedEmail}`);
    const userSnapshot = await get(userRef);
    if (!userSnapshot.exists()) {
      setError("Пользователь с таким email не зарегистрирован.");
      return;
    }

    // Генерируем код подтверждения и сохраняем его в базе данных
    const code = Math.floor(100000 + Math.random() * 900000);
    setVerificationCode(String(code));
    // Отправляем код подтверждения на почту
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
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    // Проверяем, что код подтверждения введен правильно
    if (userCode !== verificationCode) {
        setError("Неверный код подтверждения.");
        return;
      }

    // Проверяем, что новый пароль и подтверждение пароля совпадают
    if (newPassword !== confirmPassword) {
      setError("Новый пароль и подтверждение пароля не совпадают.");
      return;
    }

    // Обновляем пароль пользователя в базе данных
    const formattedEmail = email.replace(/,/g, ".").replaceAll(".",",");
    const userRef = ref(db, `Users/${formattedEmail}`);
    await update(userRef, { password: hashed_format(await sha1(newPassword)) });
    setError("Пароль успешно изменен.");

    setEmail("");
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
    setCodeSent(false);
  };

  return (
    <form>
      <h2>Восстановление пароля</h2>
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
      {!codeSent && (
        <button type="button" onClick={handleSendCode}>
          Отправить код подтверждения
        </button>
      )}
      {codeSent && (
        <>
          <label>
            Код подтверждения:
            <input
              type="text"
              id="verificationCode"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
            />
          </label>
          <label>
            Новый пароль:
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
          <label>
            Подтверждение пароля:
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
          <button type="button" onClick={handleSubmit}>
            Сохранить изменения
          </button>
        </>
      )}
    </form>
  );
}
