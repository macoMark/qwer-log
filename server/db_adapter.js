const { Pool } = require('pg');
require('dotenv').config();

// Default to the pooler string we used
// In production (Vercel), we should set DATABASE_URL env var
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.rwelakybmszgsesspkow:grunika!1002@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres';

// Handle encoded password in code if needed, but here we paste the working string
// Note: User provided 'grunika!1002', special chars need encoding in URI if not already.
// We used encodeURIComponent('grunika!1002') -> 'grunika!1002' (Wait, ! is safe-ish but let's be safe)
// Let's use the exact string we constructed in migration script, but generic.

const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

const db = {
    // Wrapper for db.all (SELECT multiple)
    all: (sql, params, callback) => {
        // Convert SQLite ? placeholders to Postgres $1, $2...
        let paramIndex = 1;
        const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);

        pool.query(pgSql, params, (err, res) => {
            if (err) {
                if (callback) callback(err, null);
            } else {
                if (callback) callback(null, res.rows);
            }
        });
    },

    // Wrapper for db.get (SELECT single)
    get: (sql, params, callback) => {
        let paramIndex = 1;
        const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);

        pool.query(pgSql, params, (err, res) => {
            if (err) {
                if (callback) callback(err, null);
            } else {
                if (callback) callback(null, res.rows[0]);
            }
        });
    },

    // Wrapper for db.run (INSERT/UPDATE/DELETE)
    run: function (sql, params, callback) {
        let paramIndex = 1;
        const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);

        pool.query(pgSql, params, (err, res) => {
            if (callback) {
                // Mimic SQLite 'this' context for lastID and changes
                // Postgres logic returns rowCount. lastID is trickier without RETURNING.
                // For this app, checking 'changes' (rowCount) is most important.
                const context = {
                    changes: res ? res.rowCount : 0,
                    lastID: 0 // Placeholder, if needed modify SQL to RETURNING id
                };
                callback.call(context, err);
            }
        });
    },

    // Helper to close pool
    close: () => {
        pool.end();
    }
};

module.exports = db;
