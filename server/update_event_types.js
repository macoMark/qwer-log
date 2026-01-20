const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

const START_CODE = '2025-rockation-america-1';
const END_CODE = '2025-rockation-america-8';

console.log("--- Updating Event Types ---");

db.serialize(() => {
    // 1. Verify existence of event_code column
    db.all("PRAGMA table_info(events)", (err, columns) => {
        if (err) {
            console.error("Schema check failed:", err);
            return;
        }

        const hasEventCode = columns.some(col => col.name === 'event_code');
        if (!hasEventCode) {
            console.error("ERROR: 'event_code' column does not exist in 'events' table.");
            console.log("Columns found:", columns.map(c => c.name).join(', '));
            return;
        }

        // 2. Check target records
        const query = "SELECT * FROM events WHERE event_code BETWEEN ? AND ?";
        db.all(query, [START_CODE, END_CODE], (err, rows) => {
            if (err) {
                console.error("Select failed:", err);
                return;
            }

            console.log(`Found ${rows.length} records matching the range.`);
            if (rows.length === 0) {
                console.log("No records to update.");
                return;
            }

            rows.forEach(r => console.log(`- [${r.event_code}] Current Type: ${r.type}, Title: ${r.title}`));

            // 3. Update
            const updateSql = "UPDATE events SET type = 'overseas' WHERE event_code BETWEEN ? AND ?";
            db.run(updateSql, [START_CODE, END_CODE], function (err) {
                if (err) {
                    console.error("Update failed:", err);
                } else {
                    console.log(`\nSuccess! Updated ${this.changes} rows.`);

                    // 4. Verify update
                    db.all(query, [START_CODE, END_CODE], (err, updatedRows) => {
                        console.log("\n--- Verification ---");
                        updatedRows.forEach(r => {
                            const status = r.type === 'overseas' ? 'OK' : 'FAIL';
                            console.log(`- [${r.event_code}] New Type: ${r.type} (${status})`);
                        });
                    });
                }
            });
        });
    });
});
