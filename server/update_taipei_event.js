const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

const eventCode = '2025-tapei-pubon';
const newType = 'overseas';

db.serialize(() => {
    db.run("UPDATE events SET type = ? WHERE event_code = ?", [newType, eventCode], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Row(s) updated: ${this.changes}`);

        // Verify
        db.get("SELECT * FROM events WHERE event_code = ?", [eventCode], (err, row) => {
            if (err) console.error(err);
            console.log("Updated Row:", row);
        });
    });
});
