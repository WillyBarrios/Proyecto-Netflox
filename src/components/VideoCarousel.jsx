import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import YouTube from 'react-youtube'
import NetflixIntro from './NetflixIntro'

function VideoCarousel({ videos, loading, API_KEY }) {
  const [modalVideo, setModalVideo] = useState(null)
  const [videoStats, setVideoStats] = useState(null)
  const [showIntro, setShowIntro] = useState(false)
  const [pendingVideo, setPendingVideo] = useState(null)
  const [playFullscreen, setPlayFullscreen] = useState(false)
  const [fullscreenVideo, setFullscreenVideo] = useState(null)
  const [videosWithStats, setVideosWithStats] = useState([])
  const [loadingStats, setLoadingStats] = useState(false)

  // Referencia al reproductor YouTube
  const playerRef = useRef(null)

  const fetchVideoStats = useCallback(async (videoId) => {
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
  }, [API_KEY])

  // Función para obtener estadísticas de todos los videos
  const fetchAllVideoStats = useCallback(async () => {
    if (!videos.length) return

    setLoadingStats(true)
    console.log('Obteniendo estadísticas para', videos.length, 'videos...')

    try {
      const videosWithStatsTemp = []
      
      // Procesar videos en lotes para no sobrecargar la API
      const batchSize = 5
      for (let i = 0; i < videos.length; i += batchSize) {
        const batch = videos.slice(i, i + batchSize)
        const batchPromises = batch.map(async (video) => {
          const stats = await fetchVideoStats(video.id.videoId)
          return { ...video, stats }
        })
        
        const batchResults = await Promise.all(batchPromises)
        videosWithStatsTemp.push(...batchResults)
        
        // Pequeña pausa entre lotes para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      setVideosWithStats(videosWithStatsTemp)
      console.log('Estadísticas obtenidas para', videosWithStatsTemp.length, 'videos')
    } catch (error) {
      console.error('Error fetching all video stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }, [videos, fetchVideoStats])

  // Memoizar las listas de videos para evitar recálculos innecesarios
  const videosByViews = useMemo(() => {
    return videosWithStats
      .filter(video => video.stats && video.stats.statistics.viewCount)
      .sort((a, b) => parseInt(b.stats.statistics.viewCount) - parseInt(a.stats.statistics.viewCount))
      .slice(0, 10)
  }, [videosWithStats])

  const videosByLikes = useMemo(() => {
    return videosWithStats
      .filter(video => video.stats && video.stats.statistics.likeCount)
      .sort((a, b) => parseInt(b.stats.statistics.likeCount) - parseInt(a.stats.statistics.likeCount))
      .slice(0, 10)
  }, [videosWithStats])

  const videosByComments = useMemo(() => {
    return videosWithStats
      .filter(video => video.stats && video.stats.statistics.commentCount)
      .sort((a, b) => parseInt(b.stats.statistics.commentCount) - parseInt(a.stats.statistics.commentCount))
      .slice(0, 10)
  }, [videosWithStats])

  // Obtener estadísticas cuando lleguen nuevos videos (solo una vez por cambio de videos)
  useEffect(() => {
    if (videos.length > 0) {
      // Limpiar estadísticas anteriores
      setVideosWithStats([])
      fetchAllVideoStats()
    }
  }, [videos, fetchAllVideoStats])

  // Componente reutilizable para cada carrusel
  const CarouselSection = ({ title, videoList, carouselId }) => {
    const scrollCarousel = (direction) => {
      const carousel = document.querySelector(`#${carouselId}`)
      const cardWidth = 335 // Ancho de cada card (320px) + gap (15px)
      const visibleCards = Math.floor(window.innerWidth / cardWidth)
      const scrollAmount = cardWidth * Math.max(1, visibleCards - 1)
      
      if (direction === 'left') {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      } else {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      }
    }

    if (!videoList.length) return null

    return (
      <div className="video-section">
        <h3 className="section-title">{title}</h3>
        <div className="carousel-container">
          <button 
            className="carousel-btn carousel-btn-left"
            onClick={() => scrollCarousel('left')}
            aria-label="Mover carrusel a la izquierda"
          >
            <span>‹</span>
          </button>
          
          <div className="video-carousel" id={carouselId}>
            {videoList.map((video) => (
              <div
                key={`${carouselId}-${video.id.videoId}`}
                className="video-card"
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
                  {/* Mostrar estadística relevante */}
                  {video.stats && (
                    <div className="video-stat-badge">
                      {carouselId === 'likes-carousel' && video.stats.statistics.likeCount && (
                        <span>👍 {parseInt(video.stats.statistics.likeCount).toLocaleString('es-ES')}</span>
                      )}
                      {carouselId === 'views-carousel' && video.stats.statistics.viewCount && (
                        <span>👁 {parseInt(video.stats.statistics.viewCount).toLocaleString('es-ES')}</span>
                      )}
                      {carouselId === 'comments-carousel' && video.stats.statistics.commentCount && (
                        <span>💬 {parseInt(video.stats.statistics.commentCount).toLocaleString('es-ES')}</span>
                      )}
                    </div>
                  )}
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
      </div>
    )
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
  // eslint-disable-next-line no-unused-vars
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
    <>
      {/* Múltiples Carruseles */}
      
      {/* Carrusel Principal - Todos los Videos */}
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
          <CarouselSection 
            title="Todos los Videos" 
            videoList={videos} 
            carouselId="main-carousel" 
          />
        )}
      </div>

      {/* Estado de carga de estadísticas */}
      {loadingStats && (
        <div className="loading">
          Obteniendo estadísticas de videos...
        </div>
      )}

      {/* Carruseles ordenados por estadísticas */}
      {!loadingStats && videosWithStats.length > 0 && (
        <>
          <CarouselSection 
            title="Videos con Más Reproducciones" 
            videoList={videosByViews} 
            carouselId="views-carousel" 
          />
          
          <CarouselSection 
            title="Videos con Más Likes" 
            videoList={videosByLikes} 
            carouselId="likes-carousel" 
          />
          
          <CarouselSection 
            title="Videos con Más Comentarios" 
            videoList={videosByComments} 
            carouselId="comments-carousel" 
          />
        </>
      )}

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
    </>
  )
}

export default VideoCarousel
