const express = require('express');
const mongoose = require('mongoose');
const characterRoutes = require('./routes/characters'); 

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB
const uri = 'mongodb://localhost:27017/game-characters';
mongoose.connect(uri, {});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Use character routes
app.use('/characters', characterRoutes);

//Implement middleware to handle not found and internal server errors

// Middleware for handling 404 Not Found errors
app.use((req, res, next) => {
    res.status(404).send('Not Found');
  });
  
// Middleware for handling internal server errors
app.use((err, req, res, next) => {
console.error(err.stack);
res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
