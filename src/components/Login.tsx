import React from 'react'

function Login() {
  return (
    <form>
      <label>
        Email:
        <input type="email" />
      </label>
      <label>
        Password:
        <input type="password" />
      </label>
      <button type="submit">Login</button>
    </form>
  )
}

export default Login