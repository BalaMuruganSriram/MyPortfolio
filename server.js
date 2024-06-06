const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); 
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Atlas connection
const mongoUri = process.env.mdbURL;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define a schema and model for the form data
const formSchema = new mongoose.Schema({
  name: String,
  email: String,
  comment: String,
}, { collection: 'formSubmissions' }); // Specify the collection name

const Form = mongoose.model('Form', formSchema);

// API route to handle form submissions
app.post('/submit', async (req, res) => {
  const { name, email, comment } = req.body;

  const newForm = new Form({
    name,
    email,
    comment,
  });

  try {
    await newForm.save();
    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
