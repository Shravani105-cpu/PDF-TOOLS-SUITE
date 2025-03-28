// Add this to your existing server.js

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
  
    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }
  
    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }
  
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user (in production, save to database)
      const newUser = {
        id: users.length + 1,
        name,
        email,
        password: hashedPassword
      };
  
      users.push(newUser);
  
      // Create JWT token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        },
        token // For immediate login after signup
      });
  
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Error creating user" });
    }
  });