const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(express.json());

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/student', (err) => {
  if (err) {
    console.error("Failed to connect:", err);
  } else {
    console.log("Connected to MongoDB");
  }
});

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Accept, Content-Type, X-Requested-With, Access-Control-Request-Method");
  next();
});

const userSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  phone_number: { type: String },
  company: { type: String },
  job_title: { type: String }
});

const User = mongoose.model('user_details', userSchema);

app.post('/save', (req, res) => {
  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    phone_number: req.body.phone_number,
    company: req.body.company,
    job_title: req.body.job_title
  });

  user.save((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to save user' });
    }
    res.status(200).json({ message: 'User details saved' });
  });
});

app.patch('/update', (req, res) => {
  const { ObjectId } = require('mongodb');
  const updatedUser = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    phone_number: req.body.phone_number,
    company: req.body.company,
    job_title: req.body.job_title
  };

  User.updateOne({ _id: new ObjectId(req.body._id) }, { $set: updatedUser }, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to update user' });
    }
    res.status(200).json({ message: 'User details updated' });
  });
});

app.get('/getAll', (req, res) => {
  User.find({}, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching data' });
    }
    res.status(200).json(result);
  });
});

app.post('/delete', (req, res) => {
  const { ObjectId } = require('mongodb');

  User.deleteOne({ _id: new ObjectId(req.body._id) }, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete user' });
    }
    res.status(200).json({ message: 'User deleted' });
  });
});

app.listen(8000, (err) => {
  if (err) {
    console.error("Server start error:", err);
  } else {
    console.log("Server running on port 8000");
  }
});
