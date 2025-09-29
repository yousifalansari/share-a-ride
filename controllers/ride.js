const express = require('express');
const Ride = require('../models/ride');
const isSignedIn = require('../middleware/is-signed-in.js');

const router = express.Router();

// Show all rides - accessible to all users/guests
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find().populate('driverId', 'username');
    res.render('ride/list.ejs', { rides });
  } catch (error) {
    res.status(500).send('Error loading rides');
  }
});



module.exports = router;