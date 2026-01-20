const db = require('./server/database');
const crypto = require('crypto');

// Wait for DB connection
setTimeout(() => {
    console.log("Ensuring User exists...");
    const username = 'testuser';
    const password = 'password';
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    db.run("INSERT OR IGNORE INTO users (id, username, password) VALUES (1, ?, ?)", [username, hashedPassword], (err) => {
        if (err) console.error("User creation error:", err);
        else console.log("User ensuring complete.");

        console.log("Seeding attendance for User 1...");
        db.all("SELECT id FROM events", [], (err, rows) => {
            if (err) {
                console.error(err);
                return;
            }
            if (rows.length === 0) {
                console.log("No events found to attend!");
                process.exit(1);
            }
            let completed = 0;
            rows.forEach(row => {
                db.run("INSERT OR IGNORE INTO attendance (user_id, event_id, status) VALUES (1, ?, 1)", [row.id], (err) => {
                    completed++;
                    if (completed === rows.length) {
                        console.log("Attendance seeding complete. Total events attended:", rows.length);
                        process.exit(0);
                    }
                });
            });
        });
    });
}, 1000);
