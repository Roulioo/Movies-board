// REACT
import React, { useState } from 'react';

// LIBS
import Fuse from 'fuse.js';

// PACKAGES
import uniqid from 'uniqid';

// API
import api from '../api';

// CSS
import './Movie.css';

/**
 * MovieAdding function
 * @param {*} props props is properties retrieved by parent ('App')
 */
const MovieAdding = (props) => {

  const [query, updateQuery] = useState(''); // useState used for current value in inputs
  const [date, updateDate] = useState(''); // useState used for date input

  let [title, updateTitle] = useState(''); // useState used for title input
  let [fuzeArray, updateFuzeArray] = useState([]); // useState used for array of fuze
  let [movieFilter] = useState([]); // useState used to loop in movies filtred
  let [isClicked, updateIsClicked] = useState(false); // useState used to display select options movie
  let [arrayOfMovies, updateArrayOfMovies] = useState([]); // useState used to storage movies from api
  let [isChoised, updateIsChoised] = useState(false); // useState to know if movie is choised in input
  let [detailsOfMovie, updateDetailsOfMovie] = useState([]) // useState used to get extra details of movie selected
  let [actors, updateActors] = useState([]) // useState to storage actors
  let [genres, updateGenres] = useState([]) // useState to storage genres
  let [similarMovies, updateSimilarMovies] = useState([]) // useState storage similar movies

  /**
   * Method trigger in all input changement
   * @param {*} currentTarget currentTarget is input selected
   */
  const onSearchMovie = ({ currentTarget }) => {
    // Instance of fuse to search in release_date key
    const fuse = new Fuse(arrayOfMovies, {
      keys: [
        'release_date'
      ]
    });
  
    // Get title movie from tmdb in input corresponding
    if (currentTarget.name === 'title' && currentTarget.value.length !== 0) {

      // Update title in input
      title = currentTarget.value;
      updateTitle(title);

      // Get data of movie searched by query params
      api.getDataMovie(currentTarget.value).then((data) => {
        // Update data retrieved from api tmdb
        arrayOfMovies = data.results;
        updateArrayOfMovies(data.results);
      })
    } else if (currentTarget.name === 'release_date'){ // Make filtring by date in movie
      // Update value in input date
      updateDate(currentTarget.value);

      // Update quer, without this date don't enter in ternary condition in below page
      updateQuery(currentTarget.value);
          
      // Array results
      fuzeArray = fuse.search(currentTarget.value);

      // Update array results
      updateFuzeArray(fuzeArray);

    } else { // If input is empty

      // Update title and date
      updateTitle(currentTarget.value);
      updateDate(currentTarget.value);

      // No values so array need to be empty
      arrayOfMovies = [];

      // Update array of movies
      updateArrayOfMovies(arrayOfMovies);

      // Set isClicked to false to display none select options and update this
      isClicked = false;
      updateIsClicked(isClicked);
    }
  }

  // Need this here because if first load page, query is empty after input date change it
  movieFilter = query ? fuzeArray.map(character => character.item) : arrayOfMovies;

  /**
   * Get movie data selected in option select
   * @param {*} movie movie is movie selected with title and date
   */
  const getMovieSelected = (movie) => {
    // Get the title movie selected to searching after in array
    const movieSelected = movie.target.value.split('/')[0].trim();

    // Get all movie data selected
    const foundMovie = arrayOfMovies.filter(x => x.title === movieSelected);

    // Get genre of movie selected from api tmdb
    api.getGenreMovie(foundMovie[0].id).then((data) => {
      // Affect url needed to have a correctly src
      data.poster_path = `https://image.tmdb.org/t/p/w342/${data.poster_path}`;
      data.backdrop_path = `https://image.tmdb.org/t/p/w342/${data.backdrop_path}`;

      // Set and update details of movie
      detailsOfMovie = data;
      updateDetailsOfMovie(detailsOfMovie);

      // Filter in genres and set genres useState and uptade it
      const genresFiltred = data.genres.map(genres => genres.name);
      genres = genresFiltred;
      updateGenres(genres);
    });

    // Get actors of movie selected from api tmdb
    api.getActorsMovie(foundMovie[0].id).then((data) => {
      // Add photo property to keep coherence in home page
      data.cast.forEach(actor => {
        actor['photo'] = `https://image.tmdb.org/t/p/w342/${actor.profile_path}`;
      });

      // Affect to actor property the array of actors
      detailsOfMovie['actors'] = data.cast;

      // Set actors useState and uptade it
      actors = data.cast;
      updateActors(actors);
    })

    // Get similar movies of movie selected from api tmdb
    api.getSimilarMovies(foundMovie[0].id).then((data) => {
      // Add poster property to keep coherence in home page
      data.forEach(similar_movie => {
        similar_movie['poster'] = `https://image.tmdb.org/t/p/w342/${similar_movie.poster_path}`;
      });

      // Affect data updated to similar_movies property
      detailsOfMovie['similar_movies'] = data;

      // Set similar movies useState and uptade it
      similarMovies = data;
      updateSimilarMovies(similarMovies);
    })

    // Set isChoised to true so display information according to movie needed (title, date, photo ...)
    isChoised = true;

    // Update isChoised boolean
    updateIsChoised(isChoised);
  }

  /**
   * Display select options if key pressed
   */
  const keypressed = () => {
    isClicked = true;
    updateIsClicked(true);
  }


  /**
   * Style of cross deletion used for actors and similar movies
   */
  const styleOfCrossDeletion = {
    'fontSize': '20px',
    'cursor': 'pointer'
  }

  // Categories
  const categories = genres.map(category => {
    return category;
  });

  /**
   * Display movie information if key is pressed in above
   */
  const DisplayMovieInformation = () => {
    if (isChoised) {
      return(
        <div className="informations-movie">
          <h1>{detailsOfMovie.title}</h1>
          <div className="mr-2 mb-2">
            <span className="movie-release-date">Release date: </span>{detailsOfMovie.release_date}
          </div>
          <div className="mt-2 mb-2">
            <span className="movie-categories mr-2">Categories:</span>{categories.map(category => category + ' ')}
          </div>
          <div className="movie-description-adding">
            <span>Description:<p className="mb-1"></p></span>{detailsOfMovie.overview}
          </div>
          <div className="row justify-content-around mt-3">
            <div className="poster-adding mt-3">
              <img src={props.addDefaultSrc(detailsOfMovie.poster_path)} alt="movie poster" className="mr-3"></img>
            </div>
            <div className="backdrop-adding mt-3 row align-items-center">
              <span>
                <img src={props.addDefaultSrc(detailsOfMovie.backdrop_path)} alt="movie backdrop"></img>
              </span>
            </div>
          </div>
          <div className="actors-adding mt-3 row flex-column">
            <h1 className="mt-3 mb-3">Actors</h1>
            <div className="row justify-content-center">
              {actors.map(actor => {
                return(
                  <div key={uniqid()} className="row flex-column actors-adding">
                    <div>
                      <img src={props.addDefaultSrc(actor.photo)} alt="img of actor"></img>
                    </div>
                    <div className="row justify-content-center">
                      <span className="mt-3 mr-3">{actor.name}</span>
                      {/* Delete similar movie before post -- REFACTOR THE NAME OF STYLE TO BE GENERAL */} 
                      <span className="cross-deletion" style={styleOfCrossDeletion} onClick={(e) => deleteActor(actor)}>&#10007;</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          {/* Similar movies */}
          <div className="row flex-column">
            <h1 className="mb-3">Similar movies</h1>
            <div className="row justify-content-center all-movies-adding">
              {similarMovies.map(similar_movie => {
                return(
                  <div key={uniqid()} className="similar-movies-adding">
                    <div>
                      <img src={props.addDefaultSrc(similar_movie.poster)} alt="similar movie poster"></img>
                    </div>
                    <div className="row justify-content-center">
                      <span className="mt-3 mr-3">{similar_movie.title}</span>
                      {/* Delete similar movie before post */}
                      <span className="cross-deletion" style={styleOfCrossDeletion} onClick={(e) => deleteSimilarMovie(similar_movie)}>&#10007;</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <button className="mb-3" type="button" onClick={(e) => postMovie(detailsOfMovie)}>ADD MOVIE</button>
        </div>
      )
    } else {
      return null;
    }
  }

  /**
   *  Display information according to movie filtring
   * @param {*} isClicked isClicked is a boolean 
   */
  const DisplayInfo = ({isClicked}) => {
    if (isClicked) {
      return (
        <div className="movie-adding row justify-content-center flex-column mt-3">
          <form>
            <select className="select-movie mb-3" onChange={(e) => getMovieSelected(e)}>
              {movieFilter.map(x => {
                return (
                  <option key={x.id}>{x.title} / ({x.release_date})</option>
                )
              })}
            </select>
            <p></p>
          </form>
          <DisplayMovieInformation></DisplayMovieInformation>
        </div>
      )
    } else {
      return null;
    }
  }

  /**
   * Post movie to local serv
   * @param {*} event event is datas of movie selected
   */
  const postMovie = (event) => {
    let categories = '';

    // If not null or undefined
    if(event.genres) {
      // Get categories name property to post field
      categories = event.genres.map(category => {
        return category.name;
      })
    }

    // Implement fields necessary to POST in local serv
    event['categories'] = categories
    event['description'] = event.overview;
    event['actors'] = actors;
    event['backdrop'] = event.backdrop_path;
    event['similar_movies'] = detailsOfMovie.similar_movies;

    // Poster url
    const poster = event.poster_path;

    // Remove fields not necessary
    Reflect.deleteProperty(event, 'adult');
    Reflect.deleteProperty(event, 'budget');
    Reflect.deleteProperty(event, 'homepage');
    Reflect.deleteProperty(event, 'imdb_id');
    Reflect.deleteProperty(event, 'popularity');
    Reflect.deleteProperty(event, 'backdrop_path');
    Reflect.deleteProperty(event, 'poster_path');
    Reflect.deleteProperty(event, 'original_title');
    Reflect.deleteProperty(event, 'belongs_to_collection');
    Reflect.deleteProperty(event, 'revenue');
    Reflect.deleteProperty(event, 'runtime');
    Reflect.deleteProperty(event, 'spoken_languages');
    Reflect.deleteProperty(event, 'production_companies');
    Reflect.deleteProperty(event, 'production_countries');
    Reflect.deleteProperty(event, 'genres');
    Reflect.deleteProperty(event, 'overview');
    Reflect.deleteProperty(event, 'vote_average');
    Reflect.deleteProperty(event, 'original_language');
    Reflect.deleteProperty(event, 'status');
    Reflect.deleteProperty(event, 'tagline');
    Reflect.deleteProperty(event, 'video');
    Reflect.deleteProperty(event, 'vode_average');
    Reflect.deleteProperty(event, 'vote_count');
    Reflect.deleteProperty(event, 'id');

    if (event.actors) {
      // Remove fields not necessary
      event.actors.map(x => {
        return (Reflect.deleteProperty(x, 'cast_id'),
        Reflect.deleteProperty(x, 'id'),
        Reflect.deleteProperty(x, 'credit_id'),
        Reflect.deleteProperty(x, 'gender'),
        Reflect.deleteProperty(x, 'order'),
        Reflect.deleteProperty(x, 'profile_path'));
      })
    }

    if (event.similar_movies) {
      // Remove fields not necessary
      event.similar_movies.map(x => {
        return (Reflect.deleteProperty(x, 'adult'),
        Reflect.deleteProperty(x, 'genre_ids'),
        Reflect.deleteProperty(x, 'backdrop_path'),
        Reflect.deleteProperty(x, 'original_language'),
        Reflect.deleteProperty(x, 'overview'),
        Reflect.deleteProperty(x, 'popularity'),
        Reflect.deleteProperty(x, 'original_title'),
        Reflect.deleteProperty(x, 'video'),
        Reflect.deleteProperty(x, 'vote_average'),
        Reflect.deleteProperty(x, 'poster_path'),
        Reflect.deleteProperty(x, 'vote_count'),
        Reflect.deleteProperty(x, 'id'));
      })
    }

    // Affect poster
    event['poster'] = poster;

    // If exist and length < 1, post an empty array (evitate error POST)
    if (event['similar_movies']) {
      if (event['similar_movies'].length < 1) {
        event['similar_movies'] = [];
      }
    }

    // Post movie and make redirection to home page
    api.postMovie(event).then((data) => {
      return data;
    }).then(() => {
      setInterval(() => {
        window.location = 'http://localhost:3001';
      }, 2000);
    })
  }

  /**
   * Delete a similar movie
   * @param {*} movie movie is movie selected to delete
   */
  const deleteSimilarMovie = (movie) => {
    // Update similar movies after clicking in cross deletion
    similarMovies = similarMovies.filter(movie_similar => movie_similar.id !== movie.id)
    updateSimilarMovies(similarMovies);

    // Affect new similar movies to post
    detailsOfMovie['similar_movies'] = similarMovies;
    updateDetailsOfMovie(detailsOfMovie);
  }

  /**
   * Delete a actor
   * @param {*} movie movie is movie selected to delete
   */
  const deleteActor = (movie) => {
    // Update actors after clicking in cross deletion
    actors = actors.filter(actor_similar => actor_similar.id !== movie.id)
    updateActors(actors);

    // Affect new actors to post
    detailsOfMovie['actors'] = actors;
    updateDetailsOfMovie(detailsOfMovie);
  }

  return (
    <div>
      <div className="movie-adding col mt-3">
        <div className="title-adding mb-3">
          <label htmlFor="title" className="mr-2">Title:</label>
          <input type="text" id="title" name="title" value={title} onKeyDown={keypressed} onChange={(e) => onSearchMovie(e)}></input>
        </div>
        <div className="release-date-adding mb-3">
          <label htmlFor="release_date" className="mr-2">Release date: </label>
          <input type="text" id="release_date" name="release_date" value={date} onKeyDown={keypressed} onChange={(e) => onSearchMovie(e)}></input>
        </div>
        <button className="btn-home-adding mb-2" onClick={props.goToHome}>HOME PAGE</button>
      </div>
      {/* Form displayed if movie is clicked in select option */}
      <DisplayInfo isClicked={isClicked}></DisplayInfo>
    </div>
    
  );
}

export default MovieAdding;
