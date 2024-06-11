import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  // тест коммит светки
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <nav className='navbar'>
      <div>Постирония</div>
      <div className="links">
        {isAuthenticated && (
          <>
            <Link to="/dashboard">Дашборд</Link>
            <Link to="/slots">Слоты</Link>
            <Link to="/slotsschedule">Расписание</Link>
            <Link to="/dormitories">Общежития</Link>
            <Link to="/washmachines">Стиралки</Link>
            <Link to="/slotsschedule">Расписание слотов</Link>
            <Link to="/profile">Профиль</Link>
          </>
        )}
        {!isAuthenticated && (
          <>
            <Link to="/login">Авторизация</Link>
            <Link to="/register">Регистрация</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
