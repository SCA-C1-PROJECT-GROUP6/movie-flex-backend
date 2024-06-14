import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     rating: { type: Number, required: true, min: 1, max: 10 }
   });

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  trailer: {
    type: String,
    required: true,
  },
  posterImg: {
    type: String,
    required: true,
  },
  actors: {
    type: [String],  // Array of strings
    required: true,
  },
  genre: {
    type: [String],  
    required: true,
  },
  ratings: [ratingSchema],
     averageRating: {
       type: Number,
       default: 0
     },
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // },
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;