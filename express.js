// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.DEV_MODE === 'true' 
    ? 'http://localhost:3000' 
    : 'https://yourdomain.com'
}));
app.use(express.json());

// Mock database
const users = [
  {
    id: 1,
    email: "user@pdftools.com",
    password: bcrypt.hashSync("securePassword123", 10),
    name: "PDF Tools User"
  }
];

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Find user
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Verify password
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Create JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    success: true,
    token, // Send token to client
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

// Development server (in production, use HTTPS)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});