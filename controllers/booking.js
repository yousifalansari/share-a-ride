const express = require('express');
const Booking = require('../models/booking');
const Ride = require('../models/ride');
const isSignedIn = require('../middleware/is-signed-in.js');

const router = express.Router();

// Index: List all bookings of current user
router.get('/', isSignedIn, async (req, res) => {
  try {
    const bookings = await Booking.find({ passengerId: req.session.user._id }).populate('rideId');
    res.render('booking/index.ejs', { bookings, user: req.session.user });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).send('Failed to load bookings');
  }
});

// New: Show form to create a booking for a ride
router.get('/new/:rideId', isSignedIn, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).send('Ride not found');
    }
    const now = new Date();
    if (ride.seatsAvailable <= 0 || new Date(ride.departureDateTime) <= now) {
      return res.status(400).send('This ride cannot be booked.');
    }
    res.render('booking/new.ejs', { ride, user: req.session.user });
  } catch (error) {
    console.error('Error loading booking form:', error);
    res.status(500).send('Failed to load booking form');
  }
});

// Create: POST create a new booking
router.post('/', isSignedIn, async (req, res) => {
  const { rideId, seatsBooked, pickupLocation } = req.body;

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const ride = await Ride.findById(rideId).session(session);

    if (!ride) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send('Ride not found');
    }

    const seats = parseInt(seatsBooked, 10);
    if (isNaN(seats) || seats < 1) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send('Invalid seat number');
    }

    if (seats > ride.seatsAvailable) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send('Not enough seats available');
    }
    if (ride.seatsAvailable <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send('Ride is full');
    }
    if (new Date(ride.departureDateTime) <= new Date()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send('Ride already started');
    }

    await Booking.create([{
      rideId,
      passengerId: req.session.user._id,
      seatsBooked: seats,
      pickupLocation
    }], { session });

    ride.seatsAvailable -= seats;
    await ride.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.redirect('/bookings');
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Booking creation error:', error);
    return res.status(500).send('Booking failed during creation');
  }
});

// Show: Show details of a specific booking
router.get('/:bookingId', isSignedIn, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate('rideId').populate('passengerId');
    res.render('booking/show.ejs', { booking, user: req.session.user });
  } catch (error) {
    console.error('Error loading booking:', error);
    res.status(500).send('Failed to load booking details');
  }
});

// Edit: Show form to edit a booking
router.get('/:bookingId/edit', isSignedIn, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate('rideId');
    res.render('booking/edit.ejs', { booking, user: req.session.user });
  } catch (error) {
    console.error('Error loading booking edit form:', error);
    res.status(500).send('Failed to load booking edit form');
  }
});

// Update: PUT update a booking
router.put('/:bookingId', isSignedIn, async (req, res) => {
  const { seatsBooked } = req.body;

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(req.params.bookingId).session(session);
    const ride = await Ride.findById(booking.rideId).session(session);

    const seats = parseInt(seatsBooked, 10);
    if (isNaN(seats) || seats < 1) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send('Invalid seat number');
    }

    const seatsDiff = seats - booking.seatsBooked;
    if (seatsDiff > 0 && seatsDiff > ride.seatsAvailable) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send('Not enough seats available to increase booking');
    }

    ride.seatsAvailable -= seatsDiff;
    await ride.save({ session });

    await Booking.findByIdAndUpdate(req.params.bookingId, { seatsBooked: seats }, { session });

    await session.commitTransaction();
    session.endSession();

    res.redirect(`/bookings/${req.params.bookingId}`);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error updating booking:', error);
    res.status(500).send('Failed to update booking');
  }
});

// Delete: Cancel a booking
router.delete('/:bookingId', isSignedIn, async (req, res) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(req.params.bookingId).session(session);
    const ride = await Ride.findById(booking.rideId).session(session);

    ride.seatsAvailable += booking.seatsBooked;
    await ride.save({ session });

    await Booking.findByIdAndDelete(req.params.bookingId, { session });

    await session.commitTransaction();
    session.endSession();

    res.redirect('/bookings');
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error deleting booking:', error);
    res.status(500).send('Failed to delete booking');
  }
});

module.exports = router;
