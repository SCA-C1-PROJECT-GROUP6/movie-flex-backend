import express from 'express';
import { createMovie, getAllMovies, searchMovies, submitRatingAndReview, getMovieReviewsAndRatings } from '../controllers/movieController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/createmovie', createMovie);  
router.get('/getallmovies', getAllMovies )
router.get('/search', searchMovies);
router.post('/rate', authMiddleware, submitRatingAndReview);
router.get('/:movieId/reviews', getMovieReviewsAndRatings);


export default router;
