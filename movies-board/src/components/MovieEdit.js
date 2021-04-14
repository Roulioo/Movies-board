// REACT
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

// API
import api from '../api';

// PACKAGES
import uniqid from 'uniqid';

/**
 * Movie edit function
 * @param {*} props props is properties retrieved by parent ('App')
 */
const MovieEdit = (props) => {  
  // Params
  const { params } = useParams();

  // Param url
  let [id] = useState(params);

  // STATES
  let [arrayToPost, updateArrayToPost] = useState({}); // useState used to update movie
  let [isChanged, updateIsChanged] = useState(false); // useState used to know if user changed or no movie
  let [movieSimilar, updateMovieSimilar] = useState(null); // useState to set movie filtred when user decide to delete a movie similar
  let [actor, updateActor] = useState(null); // useState to set actor filtred when user decide to delete a actor
  let [movieFiltred, updateMovieFiltred] = useState(''); // useState to storage props of movies retrieve by parent

  // Movie filtred by id
  movieFiltred = props.movies.filter(movie => Number(movie.id) === Number(id));

  // In reload page if no data, redirect
  if (!movieFiltred[0]) {
    alert(`Id image ${id} not exist`);
    props.goToHome();
  }

  /**
   * Method triggered in each input changement by user
   * @param {*} currentTarget currentTarget is a input props where changes take place
   */
  const onSearchEdit = ({currentTarget}) => {
    // User changed movie data
    isChanged = true;
    updateIsChanged(isChanged);

    // Title input
    if (currentTarget.name === 'title') {
      arrayToPost.title = currentTarget.value;
    }

    // Date input
    if (currentTarget.name === 'date') {
      arrayToPost.release_date = currentTarget.value;
    }

    // Description input
    if (currentTarget.name === 'description') {
      arrayToPost.description = currentTarget.value;
    }

    // Update array to post
    updateArrayToPost(arrayToPost);
  }

   /**
    * Method to affect each changement to array used to POST containt
    * @param {*} e e is a event of button update
    */
  const updateMovie = (e) => {
    e.preventDefault();

    // If user changed anything
    if (!isChanged) {
      arrayToPost.title = movieFiltred[0].title;
      arrayToPost.release_date = movieFiltred[0].release_date;
      arrayToPost.description = movieFiltred[0].description;
      window.location = 'http://localhost:3001';
    } else { // If user change values, need to verify others to no push just fields changed

      // If user not touch title
      if (!arrayToPost.title) {
        arrayToPost.title = movieFiltred[0].title;
      }

      // If user not touch release_date
      if (!arrayToPost.release_date) {
        arrayToPost.release_date = movieFiltred[0].release_date;
      }

      // If user not touch description
      if (!arrayToPost.description) {
        arrayToPost.description = movieFiltred[0].description;
      }

      // No accomplish to update actors and similard movies
      arrayToPost.categories = movieFiltred[0].categories;
      arrayToPost.similar_movies = (movieSimilar !== null) ? movieSimilar : movieFiltred[0].similar_movies;
      arrayToPost.actors = (actor !== null) ? actor : movieFiltred[0].actors;;
      arrayToPost.poster = movieFiltred[0].poster;
      arrayToPost.backdrop = movieFiltred[0].backdrop;

      // Set to localStorage the id of movie updated
      localStorage.setItem('Id', movieFiltred[0].id);
      // Delete id to post
      if (arrayToPost.similar_movies) {
        // Remove id fiel to be able to POST arrayPost
        arrayToPost.similar_movies.map(x => {
          return Reflect.deleteProperty(x, 'id');
        })
      }

      // Delete id to post
      if (arrayToPost.actors) {
        // Remove id fiel to be able to POST arrayPost
        arrayToPost.actors.map(x => {
          return Reflect.deleteProperty(x, 'id');
        })
      }

      // Put movie
      api.putMovie(arrayToPost).then((data) => {
        return data;
      }).then(() => {
        setInterval(() => {
          window.location = 'http://localhost:3001';
        }, 2000);
      })
      .catch((error) => {
        return error;
      }) 
    }
  }

   /**
    * Delete similar movie
    * @param {*} e e is a event of cross deletion
    * @param {*} movie movie is a similar movie clicked
    */
  const deleteSimilarMovie = (e, movie) => {
    // Update is changed boolean
    isChanged = true;
    updateIsChanged(isChanged);

    // Update similar movies after clicking in cross deletion
    movieSimilar = movieFiltred[0].similar_movies.filter(movie_similar => movie_similar.id !== movie.id)
    updateMovieSimilar(movieSimilar);

    // Update movie filtred to have a deletion of movie instantaneous
    movieFiltred[0].similar_movies = movieSimilar;
    updateMovieFiltred(movieFiltred);
  }

  /**
   * Delete actor
   * @param {*} e e is a event of cross deletion
   * @param {*} actor actor is a actor clicked
   */
  const deleteActor = (e, actor) => {
    // Update is changed boolean
    isChanged = true;
    updateIsChanged(isChanged);

    // Update actor after clicking in cross deletion
    actor = movieFiltred[0].actors.filter(actor_similar => actor_similar.id !== actor.id)
    updateActor(actor);

    // Update movie filtred to have a deletion of movie instantaneous
    movieFiltred[0].actors = actor;
    updateMovieFiltred(movieFiltred);
  }

  // Style for cross deletion of movies
  const styleOfSimilarMovie = {
    'fontSize': '20px',
    'cursor': 'pointer'
  }
  
  // Categories
  const categories = movieFiltred[0].categories.map(category => {
    return category;
  });

  return(
    <form className="form-edit">
      <div className="title-edit mt-3 mb-3" >
        <label htmlFor="title" className="mr-2 movie-title">Title :</label>
        <input type="text" id="title" name="title" defaultValue={movieFiltred[0].title} onChange={(e) => onSearchEdit(e)}></input>
      </div>
      <div className="date-edit mt-3 mb-3" >
        <label htmlFor="date" className="mr-2 movie-release-date">Release date:</label>
        <input type="text" id="date" name="date" defaultValue={movieFiltred[0].release_date} onChange={(e) => onSearchEdit(e)}></input>
      </div>
      <div className="description-edit mb-2" >
        <p className="movie-description-edit">Description :</p>
        <textarea id="description" name="description" cols="100" defaultValue={movieFiltred[0].description} onChange={(e) => onSearchEdit(e)}></textarea>
      </div>
      <div className="header-description row mb-3 mt-3">
        <div className="poster-edit col">
          <img src={props.addDefaultSrc(movieFiltred[0].poster)} alt="poster of movie"></img>
        </div>
        <div className="col d-flex justify-content-center align-items-center flex-column">
          <div className="categories-edit mb-3">
            <span className="movie-categories  mr-2">Categories:</span>{categories.map(category => category + ' ')}
          </div>
          <img src={props.addDefaultSrc(movieFiltred[0].backdrop)} alt="backdrop of movie"></img>
        </div>
      </div>
      <div className="actors-edit mt-3">
        <h3 className="actor-title mt-3 mb-3">Actors</h3>
        <div className="row justify-content-center">
          {movieFiltred[0].actors.map(actor => {
            return(
              <div className="actor-edit d-flex flex-column" key={uniqid()}>
                <p>{actor.name}</p>
                <img src={props.addDefaultSrc(actor.photo)} alt="img of actor"></img><p></p>
                <span style={styleOfSimilarMovie} onClick={(e) => deleteActor(e, actor)}>&#10007;</span> 
              </div>
            )
          })}
        </div>
      </div>
      <div className="similars-edit mt-3">
        <h3>SIMILAR MOVIES</h3>
        <div className="row justify-content-center">
          {movieFiltred[0].similar_movies.map(similar_movie => {
            return(
              <div className="similar-edit d-flex flex-column" key={uniqid()}>
                <p>{similar_movie.title}</p>
                <img src={props.addDefaultSrc(similar_movie.poster)} alt="poster of similar movie"></img>
                <span style={styleOfSimilarMovie} onClick={(e) => deleteSimilarMovie(e, similar_movie)}>&#10007;</span> 
              </div>
            )
          })}
        </div>
      </div>
      <button className="mb-3 mt-1" onClick={(e) => updateMovie(e)}>UPDATE MOVIE</button>
    </form>
  )
}

export default MovieEdit;
