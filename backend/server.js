import express from "express";
import cors from "cors";
import db, { initDatabase } from "./database.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
await initDatabase();

// ============= Users Endpoints =============
// GET all users
app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET user by ID
app.get("/users/:id", (req, res) => {
  db.get("SELECT * FROM users WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(row);
  });
});

// POST create new user
app.post("/users", (req, res) => {
  const { name, username, email, phone, website } = req.body;
  db.run(
    "INSERT INTO users (name, username, email, phone, website) VALUES (?, ?, ?, ?, ?)",
    [name, username, email, phone, website],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID, name, username, email, phone, website });
    },
  );
});

// PUT update user
app.put("/users/:id", (req, res) => {
  const { name, username, email, phone, website } = req.body;
  db.run(
    "UPDATE users SET name = ?, username = ?, email = ?, phone = ?, website = ? WHERE id = ?",
    [name, username, email, phone, website, req.params.id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json({ id: req.params.id, name, username, email, phone, website });
    },
  );
});

// DELETE user
app.delete("/users/:id", (req, res) => {
  db.run("DELETE FROM users WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ message: "User deleted successfully" });
  });
});

// ============= Albums Endpoints =============
// GET all albums
app.get("/albums", (req, res) => {
  db.all("SELECT * FROM albums", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET album by ID
app.get("/albums/:id", (req, res) => {
  db.get("SELECT * FROM albums WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Album not found" });
      return;
    }
    res.json(row);
  });
});

// DELETE album
app.delete("/albums/:id", (req, res) => {
  db.run("DELETE FROM albums WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Album not found" });
      return;
    }
    res.json({ message: "Album deleted successfully" });
  });
});

// ============= Photos Endpoints =============
// GET photos by album ID
app.get("/albums/:id/photos", (req, res) => {
  db.all("SELECT * FROM photos WHERE albumId = ?", [req.params.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// ============= Posts Endpoints =============
// GET all posts
app.get("/posts", (req, res) => {
  db.all("SELECT * FROM posts", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET post by ID
app.get("/posts/:id", (req, res) => {
  db.get("SELECT * FROM posts WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(row);
  });
});

// ============= Comments Endpoints =============
// GET comments by post ID
app.get("/posts/:id/comments", (req, res) => {
  db.all("SELECT * FROM comments WHERE postId = ?", [req.params.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// ============= Todos Endpoints =============
// GET todos by user ID
app.get("/todos", (req, res) => {
  const userId = req.query.userId;

  if (userId) {
    db.all("SELECT * FROM todos WHERE userId = ?", [userId], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  } else {
    db.all("SELECT * FROM todos", [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  }
});

// ============= Server Start =============
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 Database initialized and ready`);
  console.log(`\n🔗 Available endpoints:`);
  console.log(`   GET    /users`);
  console.log(`   GET    /users/:id`);
  console.log(`   POST   /users`);
  console.log(`   PUT    /users/:id`);
  console.log(`   DELETE /users/:id`);
  console.log(`   GET    /albums`);
  console.log(`   GET    /albums/:id`);
  console.log(`   DELETE /albums/:id`);
  console.log(`   GET    /albums/:id/photos`);
  console.log(`   GET    /posts`);
  console.log(`   GET    /posts/:id`);
  console.log(`   GET    /posts/:id/comments`);
  console.log(`   GET    /todos?userId=:id`);
});
