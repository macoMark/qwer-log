const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const scheduleData = require('./data/qwer_schedule');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
        process.exit(1);
    }
    console.log('Connected to the SQLite database.');
});

async function migrateAndSync() {
    db.serialize(() => {
        // 1. Schema Migration: Add Columns if they don't exist
        // SQLite doesn't support "IF NOT EXISTS" for ADD COLUMN, so we catch errors or check pragma
        console.log("Checking Schema...");

        const addColumn = (table, colDef) => {
            return new Promise((resolve) => {
                db.run(`ALTER TABLE ${table} ADD COLUMN ${colDef}`, (err) => {
                    if (err && err.message.includes('duplicate column')) {
                        // Ignore if column exists
                        resolve();
                    } else if (err) {
                        console.error(`Error adding column ${colDef}:`, err.message);
                        resolve(); // Proceed anyway?
                    } else {
                        console.log(`Added column: ${colDef}`);
                        resolve();
                    }
                });
            });
        };

        // We run these sequentially in serialize, but for cleaner async code node-sqlite3 is callback based.
        // Let's just run them.
        db.run(`ALTER TABLE events ADD COLUMN event_code TEXT`, (err) => {
            if (!err) console.log("Added column: event_code");
        });

        db.run(`ALTER TABLE events ADD COLUMN tags TEXT`, (err) => {
            if (!err) console.log("Added column: tags");
        });

        db.run(`ALTER TABLE events ADD COLUMN runtime INTEGER DEFAULT 0`, (err) => {
            if (!err) console.log("Added column: runtime");
        });

        // Create Unique Index
        db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_events_event_code ON events(event_code)`, (err) => {
            if (err) console.error("Index creation error:", err.message);
            else console.log("Verified Unique Index on event_code");
        });

        // 2. Sync Data (Upsert)
        console.log("Syncing Schedule Data...");

        if (process.argv.includes('--reset')) {
            console.log("RESET MODE: Deleting all existing events...");
            db.run("DELETE FROM events", (err) => {
                if (err) console.error("Error clearing events:", err.message);
                else console.log("Events table cleared.");
            });
        }

        const stmt = db.prepare(`
            INSERT INTO events (event_code, date, title, type, tags, runtime)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(event_code) 
            DO UPDATE SET
                date = excluded.date,
                title = excluded.title,
                type = excluded.type,
                tags = excluded.tags,
                runtime = excluded.runtime
        `);

        let completed = 0;

        db.parallelize(() => {
            scheduleData.forEach(ev => {
                const tagsJson = JSON.stringify(ev.tags || []);
                const runtime = ev.runtime || 0;
                stmt.run(ev.event_code, ev.date, ev.title, ev.type, tagsJson, runtime, (err) => {
                    if (err) console.error(`Error syncing ${ev.event_code}:`, err.message);
                });
            });
        });

        stmt.finalize(() => {
            console.log(`Sync process initiated for ${scheduleData.length} items.`);
            // Give a moment for parallel execution
            setTimeout(() => {
                console.log("Closing DB connection.");
                db.close();
            }, 1000);
        });
    });
}

migrateAndSync();
