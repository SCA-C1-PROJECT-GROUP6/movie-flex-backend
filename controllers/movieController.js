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

  if (!query) {
    res.status(400);
    return res.json({ message: "Please provide a search query" });
  }

  // Perform a case-insensitive search on the title and description fields
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
});




// rating a movie
const submitRating = asyncHandler(async (req, res) => {
  const { title, rating } = req.body;
  const userId = req.user.id;

  console.log("User ID:", userId);

  const movie = await Movie.findOne({ title });

  if (!movie) {
    res.status(404).json({ message: "Movie not found" });
    return;
  }

  const existingRating = movie.ratings.find(r => r.user.toString() === userId.toString());

  if (existingRating) {
    existingRating.rating = rating;
  } else {
    movie.ratings.push({ user: userId, rating });
  }

  movie.averageRating = movie.ratings.reduce((acc, curr) => acc + curr.rating, 0) / movie.ratings.length;

  try {
    await movie.save();
    res.status(200).json({ message: "Rating submitted successfully", averageRating: movie.averageRating });
  } catch (error) {
    console.error("Error saving movie:", error);
    res.status(500).json({ message: error.message });
  }
});

export default submitRating;


export { createMovie, getAllMovies, searchMovies, submitRating };
