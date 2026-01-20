const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

// Configuration
// NOTE: Encoding password to handle special characters like '!'
const password = encodeURIComponent('grunika!1002');
// Pooler connection string (port 6543)
const connectionString = `postgresql://postgres.rwelakybmszgsesspkow:${password}@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres`;

const pgPool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

const sqliteDbPath = path.resolve(__dirname, 'database.db');
const sqliteDb = new sqlite3.Database(sqliteDbPath);

const migrate = async () => {
    try {
        console.log("Starting Migration...");

        // 1. Create Tables in Postgres
        console.log("Creating tables in Supabase...");
        await pgPool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                date TEXT NOT NULL,
                title TEXT NOT NULL,
                type TEXT NOT NULL,
                location TEXT,
                tags TEXT,
                runtime INTEGER DEFAULT 0,
                event_code TEXT UNIQUE
            );

            CREATE TABLE IF NOT EXISTS attendance (
                user_id INTEGER REFERENCES users(id),
                event_id INTEGER REFERENCES events(id),
                status INTEGER DEFAULT 0,
                review_text TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, event_id)
            );

            CREATE TABLE IF NOT EXISTS badges (
                badge_id SERIAL PRIMARY KEY,
                badge_code TEXT UNIQUE NOT NULL,
                badge_name TEXT NOT NULL,
                badge_condition TEXT,
                badge_detail TEXT,
                badge_logic_memo TEXT,
                badge_image_url TEXT
            );
        `);

        // 2. Migrate Data

        // --- Users ---
        console.log("Migrating Users...");
        const users = await new Promise((resolve, reject) => {
            sqliteDb.all("SELECT * FROM users", (err, rows) => err ? reject(err) : resolve(rows));
        });
        for (const user of users) {
            // Check if exists to avoid dupes on re-run
            const exists = await pgPool.query("SELECT id FROM users WHERE id = $1", [user.id]);
            if (exists.rows.length === 0) {
                // Insert with explicit ID to maintain relationships
                await pgPool.query(
                    "INSERT INTO users (id, username, password) VALUES ($1, $2, $3)",
                    [user.id, user.username, user.password]
                );
            }
            // Sync sequence
            await pgPool.query(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))`);
        }

        // --- Events ---
        console.log("Migrating Events...");
        const events = await new Promise((resolve, reject) => {
            sqliteDb.all("SELECT * FROM events", (err, rows) => err ? reject(err) : resolve(rows));
        });
        for (const ev of events) {
            const exists = await pgPool.query("SELECT id FROM events WHERE id = $1", [ev.id]);
            if (exists.rows.length === 0) {
                await pgPool.query(
                    "INSERT INTO events (id, date, title, type, location, tags, runtime, event_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
                    [ev.id, ev.date, ev.title, ev.type, ev.location, ev.tags, ev.runtime, ev.event_code]
                );
            }
            await pgPool.query(`SELECT setval('events_id_seq', (SELECT MAX(id) FROM events))`);
        }

        // --- Attendance ---
        console.log("Migrating Attendance...");
        const attendances = await new Promise((resolve, reject) => {
            // Filter out orphans
            sqliteDb.all(`
                SELECT * FROM attendance 
                WHERE user_id IN (SELECT id FROM users) 
                AND event_id IN (SELECT id FROM events)
            `, (err, rows) => err ? reject(err) : resolve(rows));
        });
        for (const att of attendances) {
            const exists = await pgPool.query("SELECT * FROM attendance WHERE user_id = $1 AND event_id = $2", [att.user_id, att.event_id]);
            if (exists.rows.length === 0) {
                await pgPool.query(
                    "INSERT INTO attendance (user_id, event_id, status, review_text, updated_at) VALUES ($1, $2, $3, $4, $5)",
                    [att.user_id, att.event_id, att.status, att.review_text, att.updated_at]
                );
            }
        }

        // --- Badges ---
        console.log("Migrating Badges...");
        const badges = await new Promise((resolve, reject) => {
            sqliteDb.all("SELECT * FROM badges", (err, rows) => err ? reject(err) : resolve(rows));
        });
        for (const b of badges) {
            const exists = await pgPool.query("SELECT badge_id FROM badges WHERE badge_id = $1", [b.badge_id]);
            if (exists.rows.length === 0) {
                await pgPool.query(
                    "INSERT INTO badges (badge_id, badge_code, badge_name, badge_condition, badge_detail, badge_logic_memo, badge_image_url) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                    [b.badge_id, b.badge_code, b.badge_name, b.badge_condition, b.badge_detail, b.badge_logic_memo, b.badge_image_url]
                );
            }
            await pgPool.query(`SELECT setval('badges_badge_id_seq', (SELECT MAX(badge_id) FROM badges))`);
        }

        console.log("Migration Complete!");
        process.exit(0);

    } catch (err) {
        console.error("Migration Failed:", err);
        process.exit(1);
    }
};

migrate();
