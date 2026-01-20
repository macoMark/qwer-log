const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

const log = [];

db.serialize(() => {
    // 1. Create Partial User
    const PARTIAL_USER_ID = 999;
    db.run("INSERT OR IGNORE INTO users (id, username, password) VALUES (?, 'partial', 'pass')", [PARTIAL_USER_ID]);

    // 2. Clear Attendance
    db.run("DELETE FROM attendance WHERE user_id = ?", [PARTIAL_USER_ID]);

    // 3. Seed Attendance (Only Concerts and Fansigns)
    // This provides mix of Included (Concert) and Excluded (Fansign) types.
    db.all("SELECT * FROM events", [], (err, allEvents) => {
        if (err) { console.error(err); return; }

        const filteredToAttend = allEvents.filter(ev => ev.type === 'concert' || ev.type === 'fansign');

        const stmt = db.prepare("INSERT INTO attendance (user_id, event_id, status) VALUES (?, ?, 1)");
        filteredToAttend.forEach(ev => {
            stmt.run(PARTIAL_USER_ID, ev.id);
        });
        stmt.finalize(() => {
            runComparison(allEvents);
        });
    });

    function runComparison(allEvents) {
        // Frontend Logic Simulation
        const frontendFiltered = allEvents.filter(ev => {
            if (ev.type === 'fansign') return false;
            if (ev.type === 'overseas') return false;
            return true;
        });
        const frontendTotal = frontendFiltered.length;

        db.all("SELECT * FROM attendance WHERE user_id = ?", [PARTIAL_USER_ID], (err, allAttendance) => {
            const attMap = {};
            allAttendance.forEach(a => {
                attMap[a.event_id] = !!a.status;
            });

            // Frontend Numerator (Attended valid events)
            const frontendAttendedCount = frontendFiltered.reduce((acc, ev) => {
                return acc + (attMap[ev.id] ? 1 : 0);
            }, 0);

            const frontendRate = frontendTotal > 0 ? Math.round((frontendAttendedCount / frontendTotal) * 100) : 0;

            log.push('--- Frontend Logic (Partial User) ---');
            log.push(`Total (Filtered): ${frontendTotal}`);
            log.push(`Attended (Filtered): ${frontendAttendedCount}`);
            log.push(`Rate: ${frontendRate} %`);


            // Backend Logic Simulation
            const excludeTypes = "('fansign', 'overseas')";
            db.get(`SELECT count(*) as count FROM events WHERE type NOT IN ${excludeTypes} OR type IS NULL`, (err, row) => {
                const backendTotal = row.count;

                const sql = `
                    SELECT a.*, e.type 
                    FROM attendance a 
                    JOIN events e ON a.event_id = e.id 
                    WHERE a.user_id = ? AND a.status = 1
                `;
                db.all(sql, [PARTIAL_USER_ID], (err, attendedEvents) => {
                    const backendAttendedCount = attendedEvents.filter(a => !(a.type === 'fansign' || a.type === 'overseas')).length;
                    const backendRate = backendTotal > 0 ? Math.round((backendAttendedCount / backendTotal) * 100) : 0;

                    log.push('\n--- Backend Logic (Partial User) ---');
                    log.push(`Total (Denominator): ${backendTotal}`);
                    log.push(`Valid Attended (Numerator): ${backendAttendedCount}`);
                    log.push(`Rate: ${backendRate} %`);

                    fs.writeFileSync('debug_partial_result.txt', log.join('\n'));
                });
            });
        });
    }
});
