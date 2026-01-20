const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

console.log("Opening DB at:", dbPath);

db.serialize(() => {
    db.all("PRAGMA table_info(events)", (err, rows) => {
        if (err) {
            console.error("Schema Error:", err);
            return;
        }
        console.log("SCHEMA:", JSON.stringify(rows));

        // Check for 'rockation'
        db.all("SELECT * FROM events WHERE title LIKE '%rockation%'", (err, rows) => {
            if (err) {
                console.error("Query Error:", err);
                return;
            }
            console.log("MATCHING EVENTS:", JSON.stringify(rows, null, 2));
        });
    });
});
