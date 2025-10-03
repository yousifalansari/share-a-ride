const express = require('express');
const Review = require('../models/review');
const Ride = require('../models/ride');
const isSignedIn = require('../middleware/is-signed-in.js');

const router = express.Router();

// Index: List all reviews for logged-in user (can be adjusted)
router.get('/', isSignedIn, async (req, res) => {
  const reviews = await Review.find({ authorId: req.session.user._id }).populate('rideId');
  res.render('review/index.ejs', { reviews });
});

// New: Show form to create a review for a ride
router.get('/new/:rideId', isSignedIn, async (req, res) => {
  const ride = await Ride.findById(req.params.rideId);
  res.render('review/new.ejs', { ride });
});

// Create: POST create a new review
router.post('/', isSignedIn, async (req, res) => {
  const { rideId, rating, comment } = req.body;
  await Review.create({
    rideId,
    authorId: req.session.user._id,
    rating: parseInt(rating),
    comment,
  });
  res.redirect('/reviews');
});

// Show: Show details of a specific review
router.get('/:reviewId', isSignedIn, async (req, res) => {
  const review = await Review.findById(req.params.reviewId).populate('rideId').populate('authorId');
  res.render('review/show.ejs', { review });
});

// Edit: Show form to edit a review
router.get('/:reviewId/edit', isSignedIn, async (req, res) => {
  const review = await Review.findById(req.params.reviewId).populate('rideId');
  res.render('review/edit.ejs', { review });
});

// Update: PUT update a review
router.put('/:reviewId', isSignedIn, async (req, res) => {
  const { rating, comment } = req.body;
  await Review.findByIdAndUpdate(req.params.reviewId, {
    rating: parseInt(rating),
    comment,
  });
  res.redirect(`/reviews/${req.params.reviewId}`);
});

// Delete: Delete a review
router.delete('/:reviewId', isSignedIn, async (req, res) => {
  await Review.findByIdAndDelete(req.params.reviewId);
  res.redirect('/reviews');
});

module.exports = router;
