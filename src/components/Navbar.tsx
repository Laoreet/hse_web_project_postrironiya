import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className='navbar'>
      <div>Постирония</div>
      <div className="links">
        <Link to="/dashboard">Дашборд</Link>
        <Link to="/slots">Слоты</Link>
        <Link to="/dormitories">Общежития</Link>
        <Link to="/washmachines">Стиралки</Link>
        <Link to="/login">Авторизация</Link>
        <Link to="/register">Регистрация</Link>
      </div>
    </nav>
  )
}

export default Navbar