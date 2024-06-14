import Movie from "../models/movieModel.js";
import asyncHandler from "express-async-handler";


//adding a movie
const createMovie = asyncHandler(async (req, res) => {
  const { title, description, trailer, posterImg, actors, genre } = req.body;

  if (!title || !description || !trailer || !posterImg || !actors || !genre) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const movie = new Movie({
    title,
    description,
    trailer,
    posterImg,
    actors,
    genre,
  });

  const createdMovie = await movie.save();
  res.status(201).json(createdMovie);
});




//getting all movies
const getAllMovies = asyncHandler(async (req, res) => {
  const movies = await Movie.find({});
  res.json(movies);
});



//searching for a movie by title or genre
const searchMovies = asyncHandler(async (req, res) => {
  const { query } = req.query;
  console.log("Search query received:", query);

  if (!query) {
    res.status(400);
    return res.json({ message: "Please provide a search query" });
  }

  try {
    // Perform a case-insensitive search on the title and genre fields
    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { genre: { $regex: query, $options: "i" } },
      ],
    });

    if (movies.length === 0) {
      res.status(404);
      return res.json({ message: "Movie not found" });
    }

    res.json(movies);
  } catch (error) {
    console.error("Error searching movies:", error);
    res.status(500);
    res.json({ message: "Server error" });
  }
});



// Submit rating and review
const submitRatingAndReview = asyncHandler(async (req, res) => {
  const { movieId, rating, review } = req.body;
  const userId = req.user.id;

  const movie = await Movie.findById(movieId);

  if (!movie) {
    res.status(404);
    throw new Error("Movie not found");
  }

  const existingReview = movie.reviews.find(
    (r) => r.user.toString() === userId.toString()
  );

  if (existingReview) {
    existingReview.rating = rating;
    // Update rating and optionally update review
    existingReview.review = review || existingReview.review;
  } else {
    movie.reviews.push({ user: userId, rating, review });
  }

  // Calculate average rating
  movie.averageRating =
    movie.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
    movie.reviews.length;

  await movie.save();

  res.status(200).json({
    message: "Movie rated and reviewed successfully",
    averageRating: movie.averageRating,
  });
});


// Get movie reviews and ratings
const getMovieReviewsAndRatings = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  const movie = await Movie.findById(movieId).populate("reviews.user", "name"); // Assuming User model has a 'name' field

  if (!movie) {
    res.status(404);
    throw new Error("Movie not found");
  }

  res.status(200).json({
    averageRating: movie.averageRating,
    reviews: movie.reviews,
  });
});


export { createMovie, getAllMovies, searchMovies, submitRatingAndReview, getMovieReviewsAndRatings };
