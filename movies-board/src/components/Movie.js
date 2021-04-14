// REACT
import React from 'react';

// CSS
import './Movie.css';

/**
 * Movie function
 * @param {*} props props is properties retrieved by parent ('Movies')
 */
const Movie = (props) => {  
  // Redirection according to movie id selected
  const redirection = `/movie/${props.movie.id}`;

  return(
    <div className="movie d-flex-column">
      <h1>{props.movie.title}</h1>
      <div>
        <a href={redirection} className="img-redirect">
          <img src={props.movie.poster || props.movie.poster_path} alt="movie poster"></img>
        </a>
      </div>
      <div className="mt-2 mb-2">
        <span className="movie-release-date mr-2">Release date:</span>{props.movie.release_date}
      </div>
      <div className="movie-description mb-3">
        <p>{props.movie.description || props.movie.overview}</p>
      </div>
      <div>
        <button className="mr-2 btn-movie-update" type="button" onClick={(e) => props.goToEditMovie(props.movie.id)}>UPDATE MOVIE</button>
        <button className="btn-movie-delete" type="button" onClick={(e) => props.deleteMovie(e, props.movie.id, props.movie.title)}>DELETE MOVIE</button>
      </div>
    </div>
  );
}

export default Movie;
