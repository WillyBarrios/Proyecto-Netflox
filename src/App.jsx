import { useState, useEffect } from 'react'
import YouTube from 'react-youtube'
import './App.css'

function App() {
  const [videos, setVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [searchQuery, setSearchQuery] = useState('trailer')
  const [loading, setLoading] = useState(false)

  // Tu API Key de YouTube (reemplaza con tu propia API key)
  const API_KEY = 'AIzaSyAKon6-P8tnSxgKgP-Bxxk7wUuN0KEqbx4'

  const fetchVideos = async (query = 'trailer') => {
    setLoading(true)
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${query}&type=video&key=${API_KEY}`
      console.log('Fetching videos with URL:', url)
      
      const response = await fetch(url)
      const data = await response.json()
      
      console.log('API Response:', data)
      
      if (data.error) {
        console.error('YouTube API Error:', data.error)
        alert(`Error de API: ${data.error.message}`)
        return
      }
      
      if (data.items) {
        setVideos(data.items)
        if (data.items.length > 0) {
          setSelectedVideo(data.items[0])
        }
        console.log('Videos loaded:', data.items.length)
      } else {
        console.log('No videos found in response')
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
      alert('Error al cargar videos. Revisa la consola para más detalles.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Solo hacer la llamada si tienes una API key válida
    if (API_KEY && API_KEY !== 'TU_API_KEY_AQUI') {
      fetchVideos('trailer') // Usar valor por defecto en lugar de searchQuery
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (API_KEY && API_KEY !== 'TU_API_KEY_AQUI') {
      fetchVideos(searchQuery)
    } else {
      alert('Por favor, agrega tu API Key de YouTube en el código')
    }
  }

  const opts = {
    height: '400',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  }

  return (
    <div className="netflix-clone">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">NETFLIX CLONE</h1>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar videos..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              Buscar
            </button>
          </form>
        </div>
      </header>

      <div className="main-content">
        {/* Video Principal */}
        {selectedVideo && (
          <div className="featured-video">
            <h2 className="featured-title">{selectedVideo.snippet.title}</h2>
            <div className="video-player">
              <YouTube
                videoId={selectedVideo.id.videoId}
                opts={opts}
              />
            </div>
            <p className="featured-description">
              {selectedVideo.snippet.description.substring(0, 200)}...
            </p>
          </div>
        )}

        {/* Lista de Videos */}
        <div className="video-section">
          <h3 className="section-title">Videos Disponibles</h3>
          {loading ? (
            <div className="loading">Cargando videos...</div>
          ) : videos.length === 0 ? (
            <div className="no-videos">
              <p>No se encontraron videos. Intenta:</p>
              <ul>
                <li>Verificar que tu API Key sea válida</li>
                <li>Revisar la consola del navegador para errores</li>
                <li>Asegurarte de que YouTube Data API v3 esté habilitada</li>
              </ul>
            </div>
          ) : (
            <div className="video-grid">
              {videos.map((video) => (
                <div
                  key={video.id.videoId}
                  className={`video-card ${selectedVideo?.id.videoId === video.id.videoId ? 'active' : ''}`}
                  onClick={() => setSelectedVideo(video)}
                >
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    className="video-thumbnail"
                  />
                  <div className="video-info">
                    <h4 className="video-title">{video.snippet.title}</h4>
                    <p className="video-channel">{video.snippet.channelTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
