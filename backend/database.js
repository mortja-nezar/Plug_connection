import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create/open database
const db = new sqlite3.Database('./backend/app.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database with all tables
export const initDatabase = async () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          website TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Posts table
      db.run(`
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          title TEXT NOT NULL,
          body TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id)
        )
      `);

      // Comments table
      db.run(`
        CREATE TABLE IF NOT EXISTS comments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          postId INTEGER NOT NULL,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          body TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (postId) REFERENCES posts(id)
        )
      `);

      // Albums table
      db.run(`
        CREATE TABLE IF NOT EXISTS albums (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          title TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id)
        )
      `);

      // Photos table
      db.run(`
        CREATE TABLE IF NOT EXISTS photos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          albumId INTEGER NOT NULL,
          title TEXT NOT NULL,
          url TEXT NOT NULL,
          thumbnailUrl TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (albumId) REFERENCES albums(id)
        )
      `);

      db.run('CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts (userId)');
      db.run('CREATE INDEX IF NOT EXISTS idx_albums_user_id ON albums (userId)');
      db.run('CREATE INDEX IF NOT EXISTS idx_photos_album_id ON photos (albumId)');
      db.run('CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments (postId)');

      // Todos table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          title TEXT NOT NULL,
          completed INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id)
        )
      `,
        (err) => {
          if (err) {
            console.error('Error creating tables:', err.message);
            reject(err);
          } else {
            db.run('CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos (userId)');
            console.log('Database tables initialized successfully');
            insertSampleData();
            resolve();
          }
        }
      );
    });
  });
};

// Insert sample data
const insertSampleData = () => {
  // Check if users table already has data
  db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
    if (err) {
      console.error('Error checking users:', err.message);
      return;
    }

    if (row.count === 0) {
      console.log('Inserting sample data...');

      // Insert sample users
      const users = [
        ['أحمد محمد', 'ahmed_m', 'ahmed@example.com', '123456789', 'https://example.com'],
        ['فاطمة علي', 'fatima_a', 'fatima@example.com', '987654321', 'https://example.com'],
        ['محمد علي', 'mohammed_a', 'mohammed@example.com', '555555555', 'https://example.com'],
      ];

      users.forEach((user) => {
        db.run(
          'INSERT INTO users (name, username, email, phone, website) VALUES (?, ?, ?, ?, ?)',
          user
        );
      });

      // Insert sample posts
      const posts = [
        [1, 'أول منشور', 'هذا محتوى المنشور الأول'],
        [1, 'ثاني منشور', 'هذا محتوى المنشور الثاني'],
        [2, 'منشور من فاطمة', 'محتوى منشور من المستخدم الثاني'],
      ];

      posts.forEach((post) => {
        db.run('INSERT INTO posts (userId, title, body) VALUES (?, ?, ?)', post);
      });

      // Insert sample albums
      const albums = [
        [1, 'ألبوم الصور الأول'],
        [1, 'ألبوم الصور الثاني'],
        [2, 'ألبوم فاطمة'],
      ];

      albums.forEach((album) => {
        db.run('INSERT INTO albums (userId, title) VALUES (?, ?)', album);
      });

      // Insert sample todos
      const todos = [
        [1, 'مهمة أولى', 0],
        [1, 'مهمة ثانية', 1],
        [2, 'مهمة من فاطمة', 0],
      ];

      todos.forEach((todo) => {
        db.run('INSERT INTO todos (userId, title, completed) VALUES (?, ?, ?)', todo);
      });

      console.log('Sample data inserted successfully');
    }
  });
};

export default db;
