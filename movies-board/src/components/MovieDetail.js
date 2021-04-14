// REACT
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

// PACKAGES
import uniqid from 'uniqid';

// CSS
import './Movie.css';

/**
 * Movie detail function 
 * @param {*} props props is properties retrieved by parent ('App')
 */
const MovieDetail = (props) => {
  // Params url
  const { params } = useParams();
  let [searching] = useState(params); // Use state for params of url (id here)

  // Params of url (id here)
  if (params) {
    searching = props.movie.filter(x => Number(x.id) === Number(params));
  }

  // If searching is empty, redirect to home page
  if (searching.length < 1) {
    alert(`Id image ${params} not exist or img is deleted`);
    props.goToHome();
  }

  // Categories
  const categories = searching[0].categories.map(category => {
    return category;
  });

  // Actors
  const actors = searching[0].actors.map(actor => {
    return actor;
  });

  // Similar movies
  const similarMovies = searching[0].similar_movies.map(movie => {
    return movie;
  });

  return (
    <div className="movie-details">
      <div className="header row">
        <div className="header-detail col">
          <h1>{searching[0].title}</h1>
          <img src={props.addDefaultSrc(searching[0].poster)} alt="movie poster"></img>
        </div>
        <div className="header-description col d-flex align-items-center justify-content-center">
          <div>
            <div className="release-date-detail">
              <span className="movie-release-date mr-2">Release date:</span>{searching[0].release_date}
            </div>
            <div className="categories-detail">
              <span className="movie-categories mr-2">Categories:</span>{categories.map(category => category + ' ')}
            </div>
            <img className="mb-2 backdrop-detail" src={props.addDefaultSrc(searching[0].backdrop)} alt="movie backdrop"></img>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <h3 className="actor-title mb-3">Actors</h3>
        <div className="actors row justify-content-center">
          {actors.map(actor => 
            <span className="actor-detail" key={uniqid()}> 
              <p>{actor.name}</p>
              <img src={props.addDefaultSrc(actor.photo)} alt="img of actor"></img>
            </span>
          )}
        </div>
      </div>
      <div className="mt-3">
        <h3 className="similar-films-title mb-3">Similar films</h3>
        <div className="similar-films row justify-content-center">
          {similarMovies.map(movie => 
            <span className="similar-detail" key={uniqid()}> 
              <p>{movie.title}</p>
              <img src={props.addDefaultSrc(movie.poster)} alt="movie poster"></img>
              <p className="mt-2"><span className="movie-release-date">Release date: </span>{movie.release_date}</p>
            </span>
          )}
        </div>
      </div>
      <div className="buttons-detail row justify-content-center">
        <button onClick={(e) => props.goToEditMovie(searching[0].id)}>UPDATE MOVIE</button>
        <button type="button" onClick={(e) => props.deleteMovie(e, searching[0].id, searching[0].title)}>DELETE MOVIE</button>
        <button onClick={props.goToHome}>BACK HOME</button>
      </div>
    </div>
  )
}

export default MovieDetail;
