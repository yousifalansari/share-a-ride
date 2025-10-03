const express = require('express');
const Review = require('../models/review');
const Ride = require('../models/ride');
const Booking = require('../models/booking');
const isSignedIn = require('../middleware/is-signed-in.js');

const router = express.Router();

// List logged-in user's reviews and rides to review
router.get('/', isSignedIn, async (req, res) => {
  try {
    const reviews = await Review.find({ authorId: req.session.user._id })
      .populate({
        path: 'rideId',
        populate: { path: 'driverId', select: 'username' }
      });

    const bookings = await Booking.find({ passengerId: req.session.user._id })
      .populate({
        path: 'rideId',
        populate: { path: 'driverId', select: 'username' }
      });

    const reviewedRideIds = new Set(reviews.map(r => r.rideId._id.toString()));
    const ridesToReview = bookings
      .filter(b => !reviewedRideIds.has(b.rideId._id.toString()))
      .map(b => b.rideId);

    res.render('review/index.ejs', { reviews, ridesToReview, user: req.session.user });
  } catch {
    res.send('Failed to load reviews');
  }
});

// Public: Show reviews by ride
router.get('/ride/:rideId', async (req, res) => {
  try {
    const reviews = await Review.find({ rideId: req.params.rideId })
      .populate('authorId', 'username')
      .populate({
        path: 'rideId',
        populate: { path: 'driverId', select: 'username' }
      });
    res.render('review/ride-reviews.ejs', { reviews });
  } catch {
    res.send('Failed to load ride reviews');
  }
});

// New review form
router.get('/new/:rideId', isSignedIn, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) return res.send('Ride not found');
    res.render('review/new.ejs', { ride, user: req.session.user });
  } catch {
    res.send('Failed to load review form');
  }
});

// Create review
router.post('/', isSignedIn, async (req, res) => {
  try {
    const { rideId, rating, comment } = req.body;
    await Review.create({
      rideId,
      authorId: req.session.user._id,
      rating: parseInt(rating),
      comment,
    });
    res.redirect('/reviews');
  } catch {
    res.send('Failed to create review');
  }
});

// Show review details
router.get('/:reviewId', isSignedIn, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId)
      .populate({
        path: 'rideId',
        populate: { path: 'driverId', select: 'username' }
      })
      .populate('authorId', 'username');
    if (!review) return res.send('Review not found');
    res.render('review/show.ejs', { review, user: req.session.user });
  } catch {
    res.send('Failed to load review');
  }
});

// Edit review form
router.get('/:reviewId/edit', isSignedIn, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId)
      .populate({
        path: 'rideId',
        populate: { path: 'driverId', select: 'username' }
      });
    if (!review) return res.send('Review not found');
    res.render('review/edit.ejs', { review, user: req.session.user });
  } catch {
    res.send('Failed to load review edit form');
  }
});

// Update review
router.put('/:reviewId', isSignedIn, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    await Review.findByIdAndUpdate(req.params.reviewId, {
      rating: parseInt(rating),
      comment,
    });
    res.redirect(`/reviews/${req.params.reviewId}`);
  } catch {
    res.send('Failed to update review');
  }
});

// Delete review
router.delete('/:reviewId', isSignedIn, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect('/reviews');
  } catch {
    res.send('Failed to delete review');
  }
});

module.exports = router;
