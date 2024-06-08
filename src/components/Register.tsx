import React from 'react';

function Register() {
  return (
    <form>
    <label>
      Email:
      <input type="email" />
    </label>
    <label>
      Password:
      <input type="password"  />
    </label>
    <button type="submit">Register</button>
  </form>
  )
}

export default Register