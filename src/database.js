const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DatabaseHandler {
  constructor() {
    this.dbPath = path.join(__dirname, '../data/database.db');

    this.db = new sqlite3.Database(this.dbPath, (err) => {
      if (err) {
        console.error('Could not connect to database:', err.message);
      } else {
        console.log('Connected to the SQLite database.');
      }
    });

    this.initializeDatabase();
  }

  initializeDatabase() {
    this.db.serialize(() => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId TEXT NOT NULL,
          channelName TEXT NOT NULL,
          pingChannel TEXT NOT NULL,
          lastTimeUpdateLive TEXT NOT NULL,
          role TEXT
        )
      `, (err) => {
        if (err) {
          console.error('Error initializing database:', err.message);
        } else {
          console.log('Users table initialized.');
        }
      });
    });
  }

  async addChannel(userId, channelName, pingChannel, role = null) {
    try {
      const now = new Date().toISOString();
      return new Promise((resolve, reject) => {
        const stmt = this.db.prepare("INSERT INTO users (userId, channelName, pingChannel, lastTimeUpdateLive, role) VALUES (?, ?, ?, ?, ?)");

        stmt.run(userId, channelName, pingChannel, now, role, function (err) {
          if (err) {
            console.error('Error inserting channelName:', err.message);
            reject(err);
          } else {
            resolve(this.lastID);
          }
        });
        stmt.finalize();
      });
    } catch (err) {
      console.error('Error during addChannel operation:', err.message);
      throw err;
    }
  }


  async removeChannel(userId, channelName) {
    try {
      return new Promise((resolve, reject) => {
        const stmt = this.db.prepare("DELETE FROM users WHERE userId = ? AND channelName = ?");
        stmt.run(userId, channelName, function (err) {
          if (err) {
            console.error('Error deleting channelName:', err.message);
            reject(err);
          } else {
            resolve();
          }
        });
        stmt.finalize();
      });
    } catch (err) {
      console.error('Error during removeChannel operation:', err.message);
      throw err;
    }
  }

  async editChannelLastTime(userId, channelName, newLastTimeUpdateLive) {
    try {
      const exists = await this.checkExistChannel(userId, channelName);
      if (!exists) {
        console.log("Channel does not exist, skipping update.");
        return null;
      }

      return new Promise((resolve, reject) => {
        const stmt = this.db.prepare(
          "UPDATE users SET lastTimeUpdateLive = ? WHERE userId = ? AND channelName = ?"
        );
        stmt.run(newLastTimeUpdateLive, userId, channelName, function (err) {
          if (err) {
            console.error("Error updating channel:", err.message);
            reject(err);
          } else {
            resolve();
          }
        });
        stmt.finalize();
      });
    } catch (err) {
      console.error("Error during editChannelLastTime operation:", err.message);
      throw err;
    }
  }



  checkExistChannel(userId, channelName) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare("SELECT COUNT(*) AS count FROM users WHERE userId = ? AND channelName = ?");

      stmt.get(userId, channelName, (err, row) => {
        if (err) {
          console.error('Error checking existence:', err.message);
          reject(err);
        } else {
          const exists = row.count > 0;
          resolve(exists);
        }
      });
      stmt.finalize();
    });
  }

  getusers() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM users", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  closeDatabase() {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  }
}

module.exports = DatabaseHandler;