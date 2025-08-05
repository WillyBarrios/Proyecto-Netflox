import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Aplicar estilos de login al body cuando el componente se monta
  useEffect(() => {
    // Aplicar estilos específicos para la página de login
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.boxSizing = 'border-box';
    document.body.style.fontFamily = '"Roboto", sans-serif';
    document.body.style.background = '#000';
    document.body.style.position = 'relative';

    // Crear el pseudo-elemento before programáticamente
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      .login-page::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0.7;
        width: 100%;
        height: 100%;
        background: url(/img/fondo3.jpeg);
        background-size: cover;
        z-index: -1;
      }
      
      .logo { 
        position: absolute;
        top: 10px;
        left: 80px;
        width: 120px;
      }

      .form-wrapper {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 4px;
        padding: 70px;
        width: 450px;
        background: rgba(0, 0, 0, 0.75);
      }

      .form-wrapper h2 {
        color: #fff;
        font-size: 2rem;
        margin-bottom: 25px;
      }

      .form-control {
        height: 50px;
        position: relative;
        margin-bottom: 16px;
      }

      .form-control input {
        height: 100%;
        width: 100%;
        background: #333;
        border: none;
        border-radius: 4px;
        color: #fff;
        font-size: 1rem;
        padding: 0 20px;
        opacity: 0.7;
      }

      .form-control input:focus {
        background: #444;
        outline: none;
      }

      .form-control label {
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        color: #8c8c8c;
        transition: all 0.1s ease;
        pointer-events: none;
      }

      .form-control input:focus + label,
      .form-control input:valid + label {
        font-size: 0.75rem;
        transform: translateY(-130%);
      }

      .login-form button[type="submit"] {
        width: 100%;
        padding: 16px 0;
        font-size: 1rem;
        background: #e50914;
        color: #fff;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        transition: 0.1s ease;
        margin: 25px 0 10px;
      }

      .login-form button[type="submit"]:hover {
        background: #c40816;
      }

      .form-wrapper a {
        color: #fff;
      }

      .form-help {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      .login-container {
        width: 100%;
        margin-bottom: 10px;
      }

      .login-button {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 10px;
        font-size: 16px;
        cursor: pointer;
        border-radius: 5px;
        transition: background-color 0.3s, border-color 0.3s;
        width: 100%;
      }

      .login-button:hover {
        background-color: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.6);
      }

      .remember-me {
        display: flex;
        align-items: center;
        margin-top: 10px;
      }

      .remember-me input {
        margin-right: 10px;
      }

      .remember-me label {
        color: #fff;
      }

      .form-wrapper p {
        color: #b3b3b3;
      }

      .form-wrapper small {
        display: block;
        margin-top: 15px;
        color: #b3b3b3;
      }

      .form-wrapper small a {
        color: #0071eb;
      }

      .forgot-password {
        color: #fff !important;
      }

      @media (max-width: 740px) {
        .login-page::before {
          display: none;
        }
        .form-wrapper {
          width: 90%;
          padding: 20px;
        }
      }
    `;
    document.head.appendChild(styleElement);

    // Limpiar estilos cuando el componente se desmonta
    return () => {
      document.head.removeChild(styleElement);
      // Resetear estilos del body
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.background = '';
      document.body.style.position = '';
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías agregar validación de login
    // Por ahora, simplemente navegamos a la página principal
    navigate('/home');
  };

  return (
    <div className="login-page">
      <img src="/img/logon.png" alt="logo" className="logo" />
      <div className="form-wrapper">
        <h2>inicia sesion</h2>

        <form onSubmit={handleSubmit} className="login-form">
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
    </div>
  );
}

export default Login;
