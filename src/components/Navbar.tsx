import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  // тест коммит светки
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className='navbar fixed-top'>
      {/* <div className="postironia">Постирония</div> */}
      <div className="navbar-brand">
        <img src="/postironia.jpg" alt="Постирония" className="logo" />
      </div>
      <button
        className="navbar-toggle"
        aria-label="Toggle navigation"
        onClick={handleToggleMobileMenu}
      >
        <span className="navbar-toggle-icon"></span>
      </button>
      <div className={`links ${isMobileMenuOpen ? 'links-open' : ''}`}>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Дашборд</Link>
            <Link to="/slots">Слоты</Link>
            <Link to="/dormitories">Общежития</Link>
            <Link to="/slotsschedule">Расписание</Link>
            <Link to="/washmachines">Стиралки</Link>
            <Link to="/profile">Профиль</Link>
          </>
        ) : (
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
function setIsMobileMenuOpen(arg0: boolean) {
  throw new Error('Function not implemented.');
}

