import express from 'express';
import { getPopularMovies, searchMovies } from '../controllers/movieController.js';

const router = express.Router();

// Route to get popular movies
router.get('/popular', async (req, res) => {
  try {
    const movies = await getPopularMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching popular movies' });
  }
});

// Route to search for movies
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const movies = await searchMovies(query);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error searching movies' });
  }
});

export default router;
