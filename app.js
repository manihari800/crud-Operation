const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Connect to MongoDB (replace with your MongoDB URI)
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://manihari:Mani1234@cluster0.gtc54hl.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check the connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
const Book = require('./bookModel'); // Import the MongoDB model you created

app.use(express.json()); // Middleware to parse JSON data

// Create a new book (POST)
app.post('/books', async (req, res) => {
  const { title, author, summary } = req.body;
  const book = new Book({ title, author, summary });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// View all books (GET)
app.get('/books', async (req, res) => {
  const books = await Book.find();
  res.status(200).json(books);
});

// View details of a specific book by its ID (GET)
app.get('/books/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Update a book's details (PUT)
app.put('/books/:id', async (req, res) => {
  const { title, author, summary } = req.body;
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, { title, author, summary }, { new: true });
    if (updatedBook) {
      res.status(200).json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a book (DELETE)
app.delete('/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndRemove(req.params.id);
    if (deletedBook) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
