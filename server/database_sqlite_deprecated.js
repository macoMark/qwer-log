const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // User Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`);

        // Event Table
        db.run(`CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            title TEXT NOT NULL,
            type TEXT NOT NULL, -- 'general', 'fansign', 'overseas'
            location TEXT
        )`);

        // Attendance Table
        db.run(`CREATE TABLE IF NOT EXISTS attendance (
            user_id INTEGER,
            event_id INTEGER,
            status INTEGER DEFAULT 0, -- 0: false, 1: true
            review_text TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, event_id),
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(event_id) REFERENCES events(id)
        )`);

        // Badges Table
        db.run(`CREATE TABLE IF NOT EXISTS badges (
            badge_id INTEGER PRIMARY KEY AUTOINCREMENT,
            badge_code TEXT UNIQUE NOT NULL,
            badge_name TEXT NOT NULL,
            badge_condition TEXT,
            badge_detail TEXT,
            badge_logic_memo TEXT,
            badge_image_url TEXT
        )`);

        // Seed Events if empty
        db.get("SELECT count(*) as count FROM events", (err, row) => {
            if (err) {
                console.error(err);
                return;
            }
            if (row.count === 0) {
                console.log("Seeding events...");
                seedEvents();
            }
        });
    });
}

function seedEvents() {
    const stmt = db.prepare("INSERT INTO events (date, title, type, location) VALUES (?, ?, ?, ?)");

    // Generate dummy events for 2025
    const events = [];
    // Example: 1 event per week for 2025
    for (let month = 1; month <= 12; month++) {
        for (let day = 1; day <= 28; day += 7) {
            const dateStr = `2025-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const types = [
                'fansign', 'overseas', 'concert', 'univ_fest',
                'festival', 'rock_fest', 'awards', 'individual', 'anniversary'
            ];
            const type = types[Math.floor(Math.random() * types.length)];
            events.push({
                date: dateStr,
                title: `Event on ${dateStr}`,
                type: type,
                location: '' // Location removed as per request
            });
        }
    }

    db.serialize(() => {
        events.forEach(ev => {
            stmt.run(ev.date, ev.title, ev.type, ev.location);
        });
        stmt.finalize();
        console.log("Seeding complete.");
    });
}

module.exports = db;
