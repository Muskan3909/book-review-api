# Book Review API

A RESTful API built with Node.js and Express for managing books and reviews with JWT authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. Clone and setup:
```bash
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv helmet express-rate-limit
npm install --save-dev nodemon
```

2. Create `.env` file:
```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb+srv://dbUser:Password@book-review.ixjtoqc.mongodb.net/
JWT_SECRET=your_super_secret_jwt_key_here_please_change_this
JWT_EXPIRE=7d
```

3. Update `package.json` scripts:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

4. Run the application:
```bash
npm run dev
```

## 📁 Project Structure

```
book-review-api/
├── models/
│   ├── User.js
│   ├── Book.js
│   └── Review.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   ├── books.js
│   └── reviews.js
├── controllers/
│   ├── authController.js
│   ├── bookController.js
│   └── reviewController.js
├── config/
│   └── database.js
├── utils/
│   └── pagination.js
├── .env
├── server.js
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Books
- `GET /api/books` - Get all books (with pagination and filters)
- `GET /api/books/:id` - Get book by ID with reviews
- `POST /api/books` - Add new book (authenticated)
- `GET /api/search` - Search books by title/author

### Reviews
- `POST /api/books/:id/reviews` - Add review (authenticated)
- `PUT /api/reviews/:id` - Update your review
- `DELETE /api/reviews/:id` - Delete your review

## 📋 Example API Requests

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Add Book (Authenticated)
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Classic Literature",
    "description": "A classic American novel set in the Jazz Age."
  }'
```

### Get Books with Filters
```bash
curl "http://localhost:3000/api/books?page=1&limit=10&author=Fitzgerald&genre=Classic"
```

### Add Review
```bash
curl -X POST http://localhost:3000/api/books/BOOK_ID/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "rating": 5,
    "comment": "Absolutely loved this book!"
  }'
```

### Search Books
```bash
curl "http://localhost:3000/api/search?q=gatsby"
```

## 🗄️ Database Schema

### User
```javascript
{
  _id: ObjectId,
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Book
```javascript
{
  _id: ObjectId,
  title: String (required),
  author: String (required),
  genre: String,
  description: String,
  averageRating: Number (calculated),
  totalReviews: Number (calculated),
  addedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Review
```javascript
{
  _id: ObjectId,
  book: ObjectId (ref: Book, required),
  user: ObjectId (ref: User, required),
  rating: Number (1-5, required),
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- JWT authentication with secure tokens
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS configuration
- Security headers with Helmet
- Input validation and sanitization

## 🎯 Design Decisions

1. **MongoDB with Mongoose**: Chosen for flexibility and ease of use with JavaScript
2. **JWT Authentication**: Stateless authentication suitable for REST APIs
3. **Modular Architecture**: Separated concerns with controllers, models, and routes
4. **Pagination**: Implemented for scalable data retrieval
5. **Calculated Fields**: Average rating and review count calculated on-demand
6. **One Review Per User**: Business rule enforced at database level

## 🧪 Testing

You can test the API using:
- **Postman**: Import the collection for easy testing
- **curl**: Use the examples provided above
- **Thunder Client**: VS Code extension for API testing

---

**Note**: Make sure to replace `YOUR_JWT_TOKEN` with actual tokens received from login endpoint.
