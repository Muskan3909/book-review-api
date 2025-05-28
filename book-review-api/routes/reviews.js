const express = require('express');
const auth = require('../middleware/auth');
const {
  updateReview,
  deleteReview,
  getAllReviews,
  createReview
} = require('../controllers/reviewController');

const router = express.Router();

router.get('/', getAllReviews); // Get all reviews
router.post('/', auth, createReview); // Create a new review
router.put('/:id', auth, updateReview);
router.delete('/:id', auth, deleteReview);

module.exports = router;