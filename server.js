require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
app.use(cors());
app.use(express.json());

//db
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

//cloudinary
cloudinary.config({
  cloud_name:  process.env.CLOUD_NAME,
  api_key:     process.env.CLOUD_API_KEY,
  api_secret:  process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'mern-app', allowed_formats: ['jpg', 'jpeg', 'png'] },
});
const upload = multer({ storage });

// Schema
const User = mongoose.model('User', new mongoose.Schema({
  email:          { type: String, required: true, unique: true },
  password:       { type: String, required: true },
  gender:         String,
  city:           String,
  qualifications: [String],
  images:         [String],
}));

// routes

// Register
app.post('/api/register',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { email, password, gender, city } = req.body;
      // qualifications may come as array or comma-string
      const qualifications = [].concat(req.body.qualifications || []);
      const images = ['image1','image2','image3','image4']
        .filter(k => req.files && req.files[k])
        .map(k => req.files[k][0].path);

      const user = await User.create({ email, password, gender, city, qualifications, images });
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ userId: user._id, email: user.email });
});

// Get all users
app.get('/api/users', async (req, res) => {
  res.json(await User.find());
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// bulk upload
app.post('/api/upload', upload.array('images', 4), (req, res) => {
  const urls = req.files.map(f => f.path);
  res.json({ urls });
});

app.listen(5000, () => console.log('Server on http://localhost:5000'));
