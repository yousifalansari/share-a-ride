const express = require('express');
const Booking = require('../models/booking');
const Ride = require('../models/ride');
const isSignedIn = require('../middleware/is-signed-in.js');

const router = express.Router();

// Index: List all bookings of current user
router.get('/', isSignedIn, async (req, res) => {
  const bookings = await Booking.find({ passengerId: req.session.user._id }).populate('rideId');
  res.render('booking/index.ejs', { bookings });
});

// New: Show form to create a booking for a ride
router.get('/new/:rideId', isSignedIn, async (req, res) => {
  const ride = await Ride.findById(req.params.rideId);
  res.render('booking/new.ejs', { ride });
});

// Create: POST create a new booking
router.post('/', isSignedIn, async (req, res) => {
  const { rideId, seatsBooked } = req.body;
  await Booking.create({
    rideId: rideId,
    passengerId: req.session.user._id,
    seatsBooked: parseInt(seatsBooked) || 1
  });
  res.redirect('/bookings');
});

// Show: Show details of a specific booking
router.get('/:bookingId', isSignedIn, async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId).populate('rideId').populate('passengerId');
  res.render('booking/show.ejs', { booking });
});

// Edit: Show form to edit a booking
router.get('/:bookingId/edit', isSignedIn, async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId).populate('rideId');
  res.render('booking/edit.ejs', { booking });
});

// Update: PUT update a booking
router.put('/:bookingId', isSignedIn, async (req, res) => {
  const { seatsBooked } = req.body;
  await Booking.findByIdAndUpdate(req.params.bookingId, { seatsBooked: parseInt(seatsBooked) });
  res.redirect(`/bookings/${req.params.bookingId}`);
});

// Delete: Cancel a booking
router.delete('/:bookingId', isSignedIn, async (req, res) => {
  await Booking.findByIdAndDelete(req.params.bookingId);
  res.redirect('/bookings');
});

module.exports = router;
