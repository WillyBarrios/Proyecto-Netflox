import React from 'react';
import './moviepage.css';

const MoviePage = () => {
  return (
    <div className="banner">
      <img
        src="src/pages/src/pages/img/MV5BMTA0NDgzNTczODheQTJeQWpwZ15BbWU4MDU5MjU2NjQz._V1_.jpg" // Imagen ubicada en la carpeta "public/img/"
        alt="Tougen Anki"
        className="banner-bg"
      />
      
      <div className="banner-overlay"></div>

      <div className="banner-content">
        <h1 className="banner-title">Emoji: La película</h1>
        <p className="banner-description">
         Los emojis de Textópolis solo muestran una emoción
         exepto Gene. Pero él está dicidido a deshacerse de 
         sus expresiones y volverse un emoji normal.
        </p>

        
        <div className="banner-buttons">
          <button className="btn btn-play">▶ Reproducir</button>
          <button className="btn btn-info">ℹ Más información</button>
        </div>
        <span className="banner-age">16+</span>
      </div>
    </div>
  );
};

export default MoviePage;
