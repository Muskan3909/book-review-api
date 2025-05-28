const Book = require('../models/Book');
const Review = require('../models/Review');
const { getPagination, getPaginationInfo } = require('../utils/pagination');

// Get all books with pagination and filters
const getBooks = async (req, res) => {
  try {
    const { page, limit, author, genre } = req.query;
    const { page: currentPage, limit: pageSize, skip } = getPagination(page, limit);

    // Build filter object
    const filter = {};
    if (author) {
      filter.author = new RegExp(author, 'i'); // Case-insensitive partial match
    }
    if (genre) {
      filter.genre = new RegExp(genre, 'i');
    }

    const total = await Book.countDocuments(filter);
    const books = await Book.find(filter)
      .populate('addedBy', 'username')
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const pagination = getPaginationInfo(total, currentPage, pageSize);

    res.json({
      books,
      pagination
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get book by ID with reviews
const getBookById = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { page: currentPage, limit: pageSize, skip } = getPagination(page, limit);

    const book = await Book.findById(req.params.id).populate('addedBy', 'username');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Get reviews with pagination
    const totalReviews = await Review.countDocuments({ book: req.params.id });
    const reviews = await Review.find({ book: req.params.id })
      .populate('user', 'username')
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const reviewPagination = getPaginationInfo(totalReviews, currentPage, pageSize);

    res.json({
      book,
      reviews,
      reviewPagination
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new book
const addBook = async (req, res) => {
  try {
    const { title, author, genre, description } = req.body;

    const book = await Book.create({
      title,
      author,
      genre,
      description,
      addedBy: req.user._id
    });

    await book.populate('addedBy', 'username');

    res.status(201).json({
      message: 'Book added successfully',
      book
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Search books
const searchBooks = async (req, res) => {
  try {
    const { q, page, limit } = req.query;
    const { page: currentPage, limit: pageSize, skip } = getPagination(page, limit);

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Create search filter
    const searchFilter = {
      $or: [
        { title: new RegExp(q, 'i') },
        { author: new RegExp(q, 'i') }
      ]
    };

    const total = await Book.countDocuments(searchFilter);
    const books = await Book.find(searchFilter)
      .populate('addedBy', 'username')
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const pagination = getPaginationInfo(total, currentPage, pageSize);

    res.json({
      books,
      pagination,
      searchQuery: q
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBooks,
  getBookById,
  addBook,
  searchBooks
};
