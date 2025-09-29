const express = require('express');
const Ride = require('../models/ride');
const isSignedIn = require('../middleware/is-signed-in.js');

const router = express.Router();

// Show all rides - accessible to all users/guests
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find().populate('driverId', 'username');
    res.render('ride/index.ejs', { rides, user: req.session.user });
  } catch (error) {
    res.status(500).send('Error loading rides');
  }
});

// Show the form to create a new ride - only signed-in users (drivers)
router.get('/new', isSignedIn, (req, res) => {
  res.render('ride/new.ejs', { user: req.session.user });
});

// Handle the creation of a new ride - only signed-in users
router.post('/', isSignedIn, async (req, res) => {
  try {
    const newRide = await Ride.create({
      driverId: req.session.user._id,
      origin: req.body.origin,
      destination: req.body.destination,
      departureDateTime: req.body.departureDateTime,
      seatsAvailable: req.body.seatsAvailable,
      pricePerSeat: req.body.pricePerSeat,
      notes: req.body.notes,
    });
    res.redirect('/rides');
  } catch (error) {
    res.status(400).send('Failed to create ride');
  }
});

// Show a single ride's details
router.get('/:rideId', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId).populate('driverId', 'username');
    if (!ride) {
      return res.status(404).send('Ride not found');
    }
    res.render('ride/show.ejs', { ride, user: req.session.user });
  } catch (error) {
    res.status(500).send('Error loading ride');
  }
});

// Show the edit form for a ride - only the owner/driver
router.get('/:rideId/edit', isSignedIn, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).send('Ride not found');
    }
    if (ride.driverId.toString() !== req.session.user._id) {
      return res.status(403).send('Unauthorized');
    }
    res.render('ride/edit.ejs', { ride, user: req.session.user });
  } catch (error) {
    res.status(500).send('Error loading ride');
  }
});

// Handle ride update
router.put('/:rideId', isSignedIn, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).send('Ride not found');
    }
    if (ride.driverId.toString() !== req.session.user._id) {
      return res.status(403).send('Unauthorized');
    }
    await Ride.findByIdAndUpdate(req.params.rideId, {
      origin: req.body.origin,
      destination: req.body.destination,
      departureDateTime: req.body.departureDateTime,
      seatsAvailable: req.body.seatsAvailable,
      pricePerSeat: req.body.pricePerSeat,
      notes: req.body.notes,
    });
    res.redirect(`/rides/${req.params.rideId}`);
  } catch (error) {
    res.status(400).send('Failed to update ride');
  }
});

// Handle ride deletion - only owner/driver
router.delete('/:rideId', isSignedIn, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).send('Ride not found');
    }
    if (ride.driverId.toString() !== req.session.user._id) {
      return res.status(403).send('Unauthorized');
    }
    await Ride.findByIdAndDelete(req.params.rideId);
    res.redirect('/rides');
  } catch (error) {
    res.status(400).send('Failed to delete ride');
  }
});

module.exports = router;
