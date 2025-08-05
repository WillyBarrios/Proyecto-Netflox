import React, { useState, useEffect, useRef } from "react";
import YouTube from 'react-youtube';
import VideoCarousel from './VideoCarousel';
import "./Series.css";

function Series() {
  const [series, setSeries] = useState([]);
  const [featuredSeries, setFeaturedSeries] = useState(null);
  const [currentSearchTerm] = useState('netflix series');
  const [loading, setLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  
  // Estados para el modal de más información
  const [modalVideo, setModalVideo] = useState(null);
  const [videoStats, setVideoStats] = useState(null);

  // Referencia al reproductor YouTube
  const playerRef = useRef(null);

  // API Key de YouTube (la misma que en App.jsx)
  const API_KEY = 'AIzaSyAKon6-P8tnSxgKgP-Bxxk7wUuN0KEqbx4';

  const fetchSeries = async (query = 'netflix series') => {
    setLoading(true);
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${query} trailer&type=video&key=${API_KEY}`;
      console.log('Fetching series with URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (data.error) {
        console.error('YouTube API Error:', data.error);
        alert(`Error de API: ${data.error.message}`);
        return;
      }
      
      if (data.items) {
        setSeries(data.items);
        if (data.items.length > 0) {
          setFeaturedSeries(data.items[0]);
        }
        console.log('Series loaded:', data.items.length);
      } else {
        console.log('No series found in response');
      }
    } catch (error) {
      console.error('Error fetching series:', error);
      alert('Error al cargar series. Revisa la consola para más detalles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cargar series al inicializar el componente
    if (API_KEY && API_KEY !== 'TU_API_KEY_AQUI') {
      fetchSeries(currentSearchTerm);
    }
  }, []);

  // Función para obtener estadísticas del video
  const fetchVideoStats = async (videoId) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${API_KEY}`
      );
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        return data.items[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching video stats:', error);
      return null;
    }
  };

  // La función de búsqueda ha sido eliminada

  const handlePlayClick = () => {
    if (featuredSeries) {
      setShowVideo(true);
    }
  };

  const handleMoreInfoClick = async () => {
    if (featuredSeries) {
      const stats = await fetchVideoStats(featuredSeries.id.videoId);
      setVideoStats(stats);
      setModalVideo(featuredSeries);
    }
  };

  const closeModal = () => {
    setModalVideo(null);
    setVideoStats(null);
  };

  const videoOpts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 1,
      showinfo: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  const backgroundVideoOpts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      mute: 1,
      controls: 0,
      loop: 1,
      showinfo: 0,
      modestbranding: 1,
      rel: 0,
      iv_load_policy: 3,
      cc_load_policy: 0,
      disablekb: 1,
      fs: 0,
      playlist: '', // Se llenará dinámicamente con el videoId
    },
  };

  const modalVideoOpts = {
    height: '400',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 1,
      showinfo: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <div className="series-container">
      {/* Header simplificado */}
      <div className="series-header">
        <div className="header-left">
          <div className="section-title">
            <h2>Series</h2>
            <p className="current-search">Mostrando: {currentSearchTerm}</p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      {featuredSeries && (
        <div className="hero">
          {showVideo ? (
            <div className="hero-video-player">
              <YouTube
                videoId={featuredSeries.id.videoId}
                opts={videoOpts}
                onReady={(event) => {
                  playerRef.current = event.target;
                }}
              />
              <button 
                className="close-video-btn"
                onClick={() => setShowVideo(false)}
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <div className="hero-background">
                <YouTube
                  videoId={featuredSeries.id.videoId}
                  opts={{
                    ...backgroundVideoOpts,
                    playerVars: {
                      ...backgroundVideoOpts.playerVars,
                      playlist: featuredSeries.id.videoId
                    }
                  }}
                />
              </div>
              <div className="hero-overlay"></div>
              <div className="hero-content">
                <h2 className="series-subtitle">
                  {featuredSeries.snippet.channelTitle.toUpperCase()}
                </h2>
                <h1 className="series-title">
                  {featuredSeries.snippet.title.split(' ').slice(0, 3).join(' ').toUpperCase()}
                </h1>
                <p className="series-description">
                  {featuredSeries.snippet.description 
                    ? featuredSeries.snippet.description.substring(0, 200) + '...'
                    : 'Disfruta de este increíble contenido y sumérgete en una experiencia única.'}
                </p>
                <div className="buttons">
                  <button className="play-button" onClick={handlePlayClick}>
                    ▶ Reproducir
                  </button>
                  <button className="info-button" onClick={handleMoreInfoClick}>
                    ℹ Más información
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <p>Cargando series...</p>
        </div>
      )}

      {/* Video Carousel */}
      <VideoCarousel 
        videos={series} 
        loading={loading} 
        API_KEY={API_KEY} 
      />

      {/* API Warning */}
      {(!API_KEY || API_KEY === 'TU_API_KEY_AQUI') && (
        <div className="api-warning">
          <h3>⚠️ Configuración Requerida</h3>
          <p>Para usar esta sección, necesitas configurar la API Key de YouTube.</p>
        </div>
      )}

      {/* Modal de Video */}
      {modalVideo && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            
            <div className="modal-video">
              <YouTube
                videoId={modalVideo.id.videoId}
                opts={modalVideoOpts}
              />
            </div>
            
            <div className="modal-info">
              <h2 className="modal-title">{modalVideo.snippet.title}</h2>
              <p className="modal-channel">Canal: {modalVideo.snippet.channelTitle}</p>
              <p className="modal-date">
                Fecha de publicación: {new Date(modalVideo.snippet.publishedAt).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              
              {videoStats && (
                <div className="modal-stats-line">
                  <span className="stat-item">
                    Visualizaciones: {parseInt(videoStats.statistics.viewCount).toLocaleString('es-ES')}
                  </span>
                  {videoStats.statistics.likeCount && (
                    <span className="stat-item">
                      Likes: {parseInt(videoStats.statistics.likeCount).toLocaleString('es-ES')}
                    </span>
                  )}
                  {videoStats.statistics.commentCount && (
                    <span className="stat-item">
                      Comentarios: {parseInt(videoStats.statistics.commentCount).toLocaleString('es-ES')}
                    </span>
                  )}
                </div>
              )}
              
              <div className="modal-description-section">
                <h3 className="description-title">Descripción:</h3>
                <p className="modal-description">
                  {modalVideo.snippet.description 
                    ? modalVideo.snippet.description.substring(0, 150) + '......'
                    : 'Sin descripción disponible.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Series;