require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, "secretkey", (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user; // Store user info for later
    next();
  });
};

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      "secretkey",
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  });
});

app.post(
  "/api/posts",
  authenticateToken,
  upload.single("image"),
  (req, res) => {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const user_id = req.user.id; // Get user ID from token

    const sql =
      "INSERT INTO posts (user_id, title, content, image) VALUES (?, ?, ?, ?)";
    db.query(sql, [user_id, title, content, image], (err, result) => {
      if (err) {
        console.error("Error creating post:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({
        message: "Post created successfully!",
        postId: result.insertId,
      });
    });
  }
);

app.get("/api/posts/all", (req, res) => {
  const sql = `
    SELECT posts.*, users.name AS author, users.email AS author_email 
    FROM posts 
    JOIN users ON posts.user_id = users.id 
    ORDER BY posts.created_at DESC`;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    res.status(200).json(results);
  });
});

app.get("/api/posts", (req, res) => {
  const { userId } = req.query; // Get userId from the query params

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const sql = `
    SELECT posts.*, users.name AS author, users.email AS author_email 
    FROM posts 
    JOIN users ON posts.user_id = users.id 
    WHERE posts.user_id = ?`;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    res.status(200).json(results);
  });
});

app.get("/api/posts/:id", (req, res) => {
  const postId = req.params.id;
  const sql = `
    SELECT posts.*, users.name AS author 
    FROM posts 
    JOIN users ON posts.user_id = users.id 
    WHERE posts.id = ?`;

  db.query(sql, [postId], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.length === 0)
      return res.status(404).json({ error: "Post not found" });

    res.json(result[0]);
  });
});

app.put("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const sql = "UPDATE posts SET title = ?, content = ? WHERE id = ?";
  db.query(sql, [title, content, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ message: "Post updated successfully" });
  });
});

app.delete("/api/posts/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM posts WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
