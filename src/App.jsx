import { useState, useEffect, useRef } from 'react'
import YouTube from 'react-youtube'
import NetflixIntro from './components/NetflixIntro'
import './App.css'

function App() {
  const [videos, setVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [searchQuery, setSearchQuery] = useState('trailer')
  const [loading, setLoading] = useState(false)
  const [modalVideo, setModalVideo] = useState(null)
  const [videoStats, setVideoStats] = useState(null)
  const [showIntro, setShowIntro] = useState(false)
  const [pendingVideo, setPendingVideo] = useState(null)
  const [playFullscreen, setPlayFullscreen] = useState(false)
  const [fullscreenVideo, setFullscreenVideo] = useState(null)

  // Referencia al reproductor YouTube
  const playerRef = useRef(null)

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

  const fetchVideoStats = async (videoId) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${API_KEY}`
      )
      const data = await response.json()
      
      if (data.items && data.items.length > 0) {
        return data.items[0]
      }
      return null
    } catch (error) {
      console.error('Error fetching video stats:', error)
      return null
    }
  }

  const handlePlayClick = async (video, e) => {
    e.stopPropagation() // Evita que se ejecute el onClick del card
    
    const stats = await fetchVideoStats(video.id.videoId)
    setVideoStats(stats)
    setModalVideo(video)
  }

  const playVideoWithIntro = (video) => {
    setPendingVideo(video)
    setShowIntro(true)
    closeModal()
  }

  const onIntroComplete = () => {
    setShowIntro(false)
    if (pendingVideo) {
      setFullscreenVideo(pendingVideo)
      setPendingVideo(null)
    }
  }

  const closeModal = () => {
    setModalVideo(null)
    setVideoStats(null)
  }

  const closeFullscreenPlayer = () => {
    setFullscreenVideo(null)
    setPlayFullscreen(false)
  }

  // Efecto para manejar la tecla ESC en pantalla completa
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && fullscreenVideo) {
        closeFullscreenPlayer()
      }
    }

    if (fullscreenVideo) {
      document.addEventListener('keydown', handleKeyPress)
      return () => document.removeEventListener('keydown', handleKeyPress)
    }
  }, [fullscreenVideo])

  const scrollCarousel = (direction) => {
    const carousel = document.querySelector('.video-carousel')
    const cardWidth = 335 // Ancho de cada card (320px) + gap (15px)
    const visibleCards = Math.floor(window.innerWidth / cardWidth) // Cards visibles
    const scrollAmount = cardWidth * Math.max(1, visibleCards - 1) // Mover cards visibles - 1
    
    if (direction === 'left') {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    } else {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const opts = {
    height: '400',
    width: '100%',
    playerVars: {
      autoplay: playFullscreen ? 1 : 0,
      controls: 1,
      showinfo: 0,
      modestbranding: 1,
      rel: 0,
    },
  }

  const fullscreenOpts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 1,
      showinfo: 0,
      modestbranding: 1,
      rel: 0,
      fs: 1,
    },
  }

  // Función que se ejecuta cuando el reproductor está listo
  const onPlayerReady = (event) => {
    playerRef.current = event.target
    if (playFullscreen) {
      // Pequeño delay para asegurar que el video esté listo
      setTimeout(() => {
        try {
          // Intenta poner en pantalla completa
          if (playerRef.current && playerRef.current.getIframe()) {
            const iframe = playerRef.current.getIframe()
            if (iframe.requestFullscreen) {
              iframe.requestFullscreen()
            } else if (iframe.webkitRequestFullscreen) {
              iframe.webkitRequestFullscreen()
            } else if (iframe.mozRequestFullScreen) {
              iframe.mozRequestFullScreen()
            } else if (iframe.msRequestFullscreen) {
              iframe.msRequestFullscreen()
            }
          }
          setPlayFullscreen(false) // Reset el estado
        } catch (error) {
          console.log('Error al intentar pantalla completa:', error)
        }
      }, 1000)
    }
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
                onReady={onPlayerReady}
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
            <div className="carousel-container">
              <button 
                className="carousel-btn carousel-btn-left"
                onClick={() => scrollCarousel('left')}
                aria-label="Mover carrusel a la izquierda"
              >
                <span>‹</span>
              </button>
              
              <div className="video-carousel">
                {videos.map((video) => (
                  <div
                    key={video.id.videoId}
                    className={`video-card ${selectedVideo?.id.videoId === video.id.videoId ? 'active' : ''}`}
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="video-thumbnail-container">
                      <img
                        src={video.snippet.thumbnails.medium.url}
                        alt={video.snippet.title}
                        className="video-thumbnail"
                      />
                      <button 
                        className="play-button"
                        onClick={(e) => handlePlayClick(video, e)}
                        aria-label="Reproducir video"
                      >
                        <span>▶</span>
                      </button>
                    </div>
                    <div className="video-info">
                      <h4 className="video-title">{video.snippet.title}</h4>
                      <p className="video-channel">{video.snippet.channelTitle}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                className="carousel-btn carousel-btn-right"
                onClick={() => scrollCarousel('right')}
                aria-label="Mover carrusel a la derecha"
              >
                <span>›</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Video */}
      {modalVideo && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
            
            <div className="modal-video-info">
              <div className="modal-thumbnail-container">
                <img
                  src={modalVideo.snippet.thumbnails.high?.url || modalVideo.snippet.thumbnails.medium.url}
                  alt={modalVideo.snippet.title}
                  className="modal-thumbnail"
                />
                <div className="modal-play-overlay">
                  <button 
                    className="modal-play-button"
                    onClick={() => playVideoWithIntro(modalVideo)}
                  >
                    <span>▶</span>
                  </button>
                </div>
              </div>
              
              <div className="modal-details">
                <h2 className="modal-title">{modalVideo.snippet.title}</h2>
                <p className="modal-channel">
                  <strong>Canal:</strong> {modalVideo.snippet.channelTitle}
                </p>
                <p className="modal-date">
                  <strong>Fecha de publicación:</strong> {new Date(modalVideo.snippet.publishedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                
                {videoStats && (
                  <div className="modal-stats">
                    {videoStats.statistics.viewCount && (
                      <p className="modal-stat">
                        <strong>Visualizaciones:</strong> {parseInt(videoStats.statistics.viewCount).toLocaleString('es-ES')}
                      </p>
                    )}
                    {videoStats.statistics.likeCount && (
                      <p className="modal-stat">
                        <strong>Likes:</strong> {parseInt(videoStats.statistics.likeCount).toLocaleString('es-ES')}
                      </p>
                    )}
                    {videoStats.statistics.commentCount && (
                      <p className="modal-stat">
                        <strong>Comentarios:</strong> {parseInt(videoStats.statistics.commentCount).toLocaleString('es-ES')}
                      </p>
                    )}
                  </div>
                )}
                
                <div className="modal-description">
                  <h4>Descripción:</h4>
                  <p>{modalVideo.snippet.description.substring(0, 300)}...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Netflix Intro */}
      {showIntro && (
        <NetflixIntro onComplete={onIntroComplete} />
      )}

      {/* Reproductor en Pantalla Completa */}
      {fullscreenVideo && (
        <div className="fullscreen-player">
          <button 
            className="fullscreen-close"
            onClick={closeFullscreenPlayer}
            aria-label="Cerrar reproductor"
          >
            ✕
          </button>
          <div className="fullscreen-video-container">
            <YouTube
              videoId={fullscreenVideo.id.videoId}
              opts={fullscreenOpts}
              onEnd={closeFullscreenPlayer}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
