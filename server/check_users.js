const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

console.log("Listing all users:");
db.all("SELECT id, username FROM users", [], (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(rows);
});
