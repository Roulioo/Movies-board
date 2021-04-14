// PACKAGE - HOOKS
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// LIBS
import Fuse from 'fuse.js';

// PACKAGES
import uniqid from 'uniqid';

// CSS
import './App.css';

// API
import api from './api';

// COMPONENTS
import Movies from './components/Movies';
import MovieDetail from './components/MovieDetail';
import MovieAdding from './components/MovieAdding';
import MovieEdit from './components/MovieEdit'

/**
 * Function App, render all application
 */
function App() {

    /** STATES */
    const [data, updateData] = useState([]); // useState for data from API
    const [title, updateTitle] = useState(''); // useState for input title name
    const [date, updateDate] = useState(''); // useState for input date name
    const [category, updateCategory] = useState(''); // useState for input category name

    let [query, updateQuery] = useState(''); // useState for FUZE searching
    let [fuzeArray, updateFuzeArray] = useState(); // useState for fuzeArray values
    let [moviesFilter] = useState(); // useState for movies filtrer by fuze
    let [deletionId] = useState(''); // useState used to delete movie
    let [local] = (''); // useState used to local storage

    /**
     * Method trigger in all input changement
     * @param {*} currentTarget currentTarget is value emitted in input 
     */
    const onSearch = ({ currentTarget }) => {

      // Evitate to filter in bad input with others data
      let key = String(currentTarget.name);

      // Manage case category property name
      if (key === 'category') {
        key = 'categories';
      } else {
        key = currentTarget.name;
      }

      // New instance of Fuse.js
      const fuse = new Fuse(data, {
        // Search in title, release_data and categories
        keys: [
          key
        ],
        includeScore: true // Use to display score of searching (Not necessary)
      });

      // Affect searching query to an array fuze
      fuzeArray = fuse.search(currentTarget.value); // currentTarget.value is the query searched (Ex: Spider ..)
      updateFuzeArray(fuzeArray)

      // By default fuze see a empty query so it's doesn't match with anything
      moviesFilter = currentTarget.value ? fuzeArray.map(character => character.item) : data;

      // Title input
      if (currentTarget.name === 'title') {
        updateQuery(currentTarget.value);
        updateTitle(currentTarget.value);
      }

      // Date input
      if (currentTarget.name === 'release_date') {
        updateQuery(currentTarget.value);
        updateDate(currentTarget.value);
      }

      // Category input
      if (currentTarget.name === 'category') {
        updateQuery(currentTarget.value);
        updateCategory(currentTarget.value);
      }
    }

    // Display data if nothing query
    moviesFilter = query ? fuzeArray.map(character => character.item) : data;

    // Hook useEffect, triggering in each first load app
    useEffect(() => {

      // If the previous movie updated you have a id setted
      local = localStorage.getItem('Id');

      // If a movie has been updated
      if (local) {
        api.getMovie().then((data) => { // Get movie data from local serv
          data.forEach(x => {
            // Update movie
            if (Number(x.id) === Number(local)) {
              // Delete variable in localstorage after updating movie
              local = localStorage.removeItem('Id');

              api.deleteMovie(x.id).then((data) => {
                //  Update data after deletion
                updateData(data);          
                return data;
              }).catch((error) => {
                return error;
              })
            }
          })
        });
      } else {
        api.getMovie().then((data) => {
          // Update data with data getted
          updateData(data);

          // Generate id needed in edit page
          data.map(movie => {
            // Generate id of similar movies used to be able to delete in edit page
            if (movie['similar_movies']) {
              if (movie.similar_movies.length > 0) {
                movie.similar_movies.map(x => {
                  return x['id'] = uniqid();
                })
              }
            }

            // Generate id of actors used to be able to delete in edit page
            if (movie['actors']) {
              if (movie.actors.length > 0) {
                movie.actors.map(x => {
                  return x['id'] = uniqid();
                })
              }
            }
          }) 
        });
      }
    }, []);


    // Affect to movie a property poster
    data.map(movie => {
      return moviesFilter['poster'] = movie.poster;
    })

    /**
     * Delete movie
     * @param {*} e e is event of element clicked
     * @param {*} id id of movie
     * @param {*} name name of movie
     */
    const deleteMovie = (e, id, name) => {
      // Make prompt message for user
      const response = prompt(`Do you want to delete ${name} film ? Say Yes or No`);

      // Retrieve id movie and delete it
      if (response === 'Yes' || response === 'yes') {
        deletionId = id;
      } else {
        return null;
      }

      // Delete movie to local serv
      api.deleteMovie(deletionId);
    }

    /**
     * Go to movie adding page
     */
    const goToMovie = () => {
      window.location = 'http://localhost:3001/movieAdding';
    }

    /**
     * Go to home page
     */
    const goToHome = () => {
      window.location = 'http://localhost:3001/';
    }

    /**
     * Function to add default img if no exist
     * @param {*} img img is img href corresponding to img selected
     */
    const addDefaultSrc = (img) => {
      if (img) {
        // Check if img is a .jpg retrieved by tmdb api
        if (img.indexOf('.jpg') === -1 ) {
          img = 'https://www.adenine-rh.com/wp-content/themes/consultix/images/no-image-found-360x250.png';
          return img;
        } else if (img.indexOf('.jpg') !== -1){
          return img;
        } 
      }
    }

    /**
     * Go to edit movie page
     * @param {*} id id is id of movie clicked
     */
    const goToEditMovie = (id) => {
      window.location = `http://localhost:3001/movie/edit/${id}`;
    }

    return data.length < 1 ? (
      <div className="App">Loading ...</div>
    ) : (
      <BrowserRouter>
        <div className="App">
          <Switch>
            {/* Home page */}
            <Route exact path="/">
              <form className="home-form row justify-content-center">
                <div className="home-title mt-3 mr-3">
                  <label htmlFor="title" className="mr-2">Title: </label>
                  <input type="text" id="title" name="title" value={title} onChange={onSearch}></input>
                </div>
                <div className="home-date mt-3 mr-3">
                  <label htmlFor="release_date" className="mr-2">Release date:</label>
                  <input type="text" id="release_date" name="release_date" value={date} onChange={onSearch}></input>
                </div>
                <div className="home-category mt-3">
                  <label htmlFor="category" className="mr-2">Categories:</label>
                  <input type="text" id="category" name="category" value={category} onChange={onSearch}></input>
                </div>
              </form>
              <button className="home-addMovie btn-home-add mt-3" onClick={goToMovie}>ADD A FILM</button>
              <Movies movies={moviesFilter} deleteMovie={deleteMovie} goToEditMovie={goToEditMovie}></Movies>
            </Route>
            {/* Detail movie */}
            <Route exact path="/movie/:params">
              <MovieDetail movie={data} goToHome={goToHome} deleteMovie={deleteMovie} addDefaultSrc={addDefaultSrc} goToEditMovie={goToEditMovie}></MovieDetail>
            </Route>
            {/* Adding a movie */}
            <Route exact path="/movieAdding">
              <MovieAdding goToHome={goToHome} addDefaultSrc={addDefaultSrc}></MovieAdding>
            </Route>
            {/* Edit movie detail */}
            <Route exact path="/movie/edit/:params">
              <MovieEdit goToHome={goToHome} movies={moviesFilter} addDefaultSrc={addDefaultSrc}></MovieEdit>
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    )
}

export default App;
