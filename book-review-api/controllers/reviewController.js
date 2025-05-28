const Review = require('../models/Review');
const Book = require('../models/Book');

// Helper function to update book rating
const updateBookRating = async (bookId) => {
  const reviews = await Review.find({ book: bookId });
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;

  await Book.findByIdAndUpdate(bookId, {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalReviews
  });
};

// Add review
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const bookId = req.params.id;
    const userId = req.user._id;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({ book: bookId, user: userId });
    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this book' 
      });
    }

    // Create review
    const review = await Review.create({
      book: bookId,
      user: userId,
      rating,
      comment
    });

    await review.populate('user', 'username');

    // Update book rating
    await updateBookRating(bookId);

    res.status(201).json({
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const reviewId = req.params.id;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ 
        message: 'You can only update your own reviews' 
      });
    }

    // Update review
    review.rating = rating || review.rating;
    review.comment = comment !== undefined ? comment : review.comment;
    await review.save();

    await review.populate('user', 'username');

    // Update book rating
    await updateBookRating(review.book);

    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ 
        message: 'You can only delete your own reviews' 
      });
    }

    const bookId = review.book;
    await Review.findByIdAndDelete(reviewId);

    // Update book rating
    await updateBookRating(bookId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews (optionally paginated)
const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await Review.countDocuments();
    const reviews = await Review.find()
      .populate('user', 'username')
      .populate('book', 'title author')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      reviews,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new review (not tied to a book endpoint)
const createReview = async (req, res) => {
  try {
    const { book, rating, comment } = req.body;
    const userId = req.user._id;

    // Check if book exists
    const bookDoc = await Book.findById(book);
    if (!bookDoc) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({ book, user: userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    // Create review
    const review = await Review.create({
      book,
      user: userId,
      rating,
      comment
    });

    await review.populate('user', 'username');

    // Update book rating
    await updateBookRating(book);

    res.status(201).json({
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addReview,
  updateReview,
  deleteReview,
  getAllReviews,
  createReview
};