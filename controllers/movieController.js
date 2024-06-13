import axios from "axios";
import dotenv from 'dotenv'
dotenv.config()


//third party movie api
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const getPopularMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};


//search for a movie
const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: query,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};


export { getPopularMovies, searchMovies };


