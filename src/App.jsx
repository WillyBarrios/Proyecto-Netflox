import Series from './components/series'
import './App.css'

function App() {
  // Tu API Key de YouTube (reemplaza con tu propia API key)
  const API_KEY = 'AIzaSyAKon6-P8tnSxgKgP-Bxxk7wUuN0KEqbx4'

  return (
    <div className="netflix-clone">
      {/* Series Component - Maneja todo internamente */}
      <Series />

      {/* Instrucciones para API Key */}
      {(!API_KEY || API_KEY === 'TU_API_KEY_AQUI') && (
        <div className="api-warning">
          <h3>⚠️ Configuración Requerida</h3>
          <p>Para usar esta aplicación, necesitas:</p>
          <ol>
            <li>Obtener una API Key de YouTube desde <a href="https://console.developers.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
            <li>Habilitar la YouTube Data API v3</li>
            <li>Reemplazar 'TU_API_KEY_AQUI' en el código con tu API key real</li>
          </ol>
        </div>
      )}
    </div>
  )
}

export default App
