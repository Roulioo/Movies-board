// AXIOS
import axios from "axios";

// Instance for local server
const local_instance = axios.create({
  baseURL: "http://localhost:3000",
  headers:
    typeof window !== "undefined"
      ? {}
      : {
        'X-Custom-Header': 'foobar'
      },
  timeout: 30000,
})

// Instance for tmdb api
const tmbd_instance = axios.create({
  baseURL: "https://api.themoviedb.org/3/search/",
  headers:
    typeof window !== "undefined"
      ? {}
      : {
        'X-Custom-Header': 'foobar'
      },
  timeout: 30000,
})

/**
 * Const API used to declare methods and make operations from backend
 */
const api = {
  getMovie: async () => { // Get movie to local serv
    return local_instance
      .get("/movies")
      .then((data) => {
        return data.data;
      })
      .catch((error) => {
        return error;
      });
  },
  deleteMovie: async(id) => { // Delete movie to local serv
    return local_instance
    .delete(`movies/${id}`)
    .then((data) => {
      window.location.reload();
      return data;
    })
    .catch((error) => {
      return error;
    });
  },
  postMovie: async(values) => { // Post data to local serv
    return local_instance
    .post('/movies', values)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error;
    })
  },
  getDataMovie: async(query) => { // Get data about query movie entered
    return tmbd_instance
    .get(`movie?api_key=4b5548762e68b175a39dfd298cdcf540&query=${query}`)
    .then((data) => {
      return data.data;
    })
    .catch((error) => {
      return error;
    })
  },
  getGenreMovie: async(id) => { // Get genres movies from api tmdb
    return tmbd_instance
    .get(`https://api.themoviedb.org/3/movie/${id}?api_key=4b5548762e68b175a39dfd298cdcf540`)
    .then((data) => {
      return data.data;
    })
    .catch((error) => {
      return error;
    })
  },
  getActorsMovie: async(id) => { // Get actors movies from api tmdb
    return tmbd_instance
    .get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=4b5548762e68b175a39dfd298cdcf540`)
    .then((data) => {
      return data.data;
    })
    .catch((error) => {
      return error;
    })
  },
  getSimilarMovies: async(id) => { // Get similar movies from api tmdb
    return tmbd_instance
    .get(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=4b5548762e68b175a39dfd298cdcf540&language=en-US&page=1`)
    .then((data) => {
      return data.data.results;
    })
    .catch((error) => {
      return error;
    })
  },
  getRoleOfActor: async(id) => { // Get roles of actors (Not implemented -- difficulty)
    return tmbd_instance
    .get(`https://api.themoviedb.org/3/credit/${id}?api_key=4b5548762e68b175a39dfd298cdcf540`)
    .then((data) => {
      return data.data;
    })
    .catch((error) => {
      return error;
    })
  },
  putMovie: async(values) => { // Put not work so I used post need to refactor
    return local_instance
    .post('/movies', values)
    .then((data) => {
      return data.data;
    })
    .catch((error) => {
      return error;
    })
  }
};

export default api;
