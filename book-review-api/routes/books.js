const express = require('express');
const auth = require('../middleware/auth');
const { getBooks, getBookById, addBook } = require('../controllers/bookController');
const { addReview } = require('../controllers/reviewController');

const router = express.Router();

router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', auth, addBook);
router.post('/:id/reviews', auth, addReview);

module.exports = router;