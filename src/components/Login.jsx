import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías agregar validación de login
    // Por ahora, simplemente navegamos a la página principal
    navigate('/home');
  };

  return (
    <>
      <img src="/img/logon.png" alt="logo" className="logo" />
      <div className="form-wrapper">
        <h2>inicia sesion</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <input 
              type="text" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email o numero de celular</label>
          </div>

          <div className="form-control">
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>contraseña</label>
          </div>

          <button type="submit">Iniciar Sesion</button>

          <div className="form-help">
            <div className="login-container">
              <div style={{ textAlign: 'center', padding: '5px' }}>
                <label style={{ color: 'white' }}>O</label>
              </div>
              <button type="button" className="login-button">
                Usar un código de inicio de Sesión
              </button>
            </div>

            <p>
              <a href="#" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </a>
            </p>

            <div className="remember-me">
              <input type="checkbox" id="remember-me" />
              <label htmlFor="remember-me">Recuérdame</label>
            </div>
          </div>
        </form>
        <p>
          ¿Primera vez en Netflix?<a href="#">Suscríbete ya.</a>
        </p>
        <small>
          Esta pagina esta protegida por Google reCAPCHAT para comprobar que no eres un robot.
          <a href="#">Más Info.</a>
        </small>
      </div>
    </>
  );
}

export default Login;
