// REACT
import React from 'react';

// COMPONENTS
import Movie from './Movie'

// CSS
import './Movie.css';

/**
 * Movies function
 * @param {*} props props is properties retrieved by parent ('App')
 */
const Movies = (props) => {
  return (
    <div className="movies row justify-content-center">
      {props.movies.map((movie) => (
        <Movie key={movie.id} movie={movie} deleteMovie={props.deleteMovie} goToEditMovie={props.goToEditMovie}/>
      ))}
    </div>
  );
}

export default Movies;
