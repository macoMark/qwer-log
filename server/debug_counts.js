const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

const USER_ID = 1; // Assuming user ID 1 for testing
const log = [];

db.serialize(() => {

    // 1. Check Distinct Types first
    db.all("SELECT DISTINCT type FROM events", [], (err, types) => {
        if (err) { console.error(err); return; }
        const distinctTypes = types.map(t => t.type);
        log.push('Distinct Types in DB: ' + JSON.stringify(distinctTypes));

        // 2. Fetch All Events to simulate Frontend
        db.all("SELECT * FROM events", [], (err, allEvents) => {
            if (err) { console.error(err); return; }

            // Frontend Logic Simulation (Dashboard.jsx)
            // Filter: !fansign && !overseas
            // Dashboard.jsx:
            // if (!filter.fansign && ev.type === 'fansign') return false
            // if (!filter.overseas && ev.type === 'overseas') return false
            // Assumes filters are OFF (Excluded)
            const frontendFiltered = allEvents.filter(ev => {
                if (ev.type === 'fansign') return false;
                if (ev.type === 'overseas') return false;
                return true;
            });

            const frontendTotal = frontendFiltered.length;

            // Fetch Attendance for User
            db.all("SELECT * FROM attendance WHERE user_id = ?", [USER_ID], (err, allAttendance) => {
                if (err) { console.error(err); return; }

                // Create Map
                const attMap = {};
                allAttendance.forEach(a => {
                    attMap[a.event_id] = !!a.status;
                });

                // Frontend Numerator
                const frontendAttendedCount = frontendFiltered.reduce((acc, ev) => {
                    return acc + (attMap[ev.id] ? 1 : 0);
                }, 0);

                const frontendRate = frontendTotal > 0 ? Math.round((frontendAttendedCount / frontendTotal) * 100) : 0;

                log.push('--- Frontend Logic Simulation ---');
                log.push(`Total Events (Filtered): ${frontendTotal}`);
                log.push(`Attended (Filtered): ${frontendAttendedCount}`);
                log.push(`Rate: ${frontendRate} %`);


                // 3. Backend Logic Simulation (server/index.js)
                // Query for Denominator
                // Note: using string interpolation for debugging purposes to match the original code
                const excludeTypes = "('fansign', 'overseas')";
                db.get(`SELECT count(*) as count FROM events WHERE type NOT IN ${excludeTypes} OR type IS NULL`, (err, row) => {
                    if (err) { console.error(err); return; }
                    const backendTotal = row.count;

                    // Query for Numerator (Attendance JOIN Events)
                    const sql = `
                        SELECT a.*, e.type 
                        FROM attendance a 
                        JOIN events e ON a.event_id = e.id 
                        WHERE a.user_id = ? AND a.status = 1
                    `;
                    db.all(sql, [USER_ID], (err, attendedEvents) => {
                        // Logic in index.js:
                        // const validAttendanceCount = attendance.filter(a => !(a.type === 'fansign' || a.type === 'overseas')).length;
                        const backendAttendedCount = attendedEvents.filter(a => !(a.type === 'fansign' || a.type === 'overseas')).length;

                        const backendRate = backendTotal > 0 ? Math.round((backendAttendedCount / backendTotal) * 100) : 0;

                        log.push('\n--- Backend Logic Simulation ---');
                        log.push(`Total Valid Events (Denominator): ${backendTotal}`);
                        log.push(`Valid Attendance (Numerator): ${backendAttendedCount}`);
                        log.push(`Rate: ${backendRate} %`);

                        if (frontendTotal !== backendTotal) {
                            log.push('\n[MISMATCH] Total Counts differ!');
                            log.push(`Frontend Total: ${frontendTotal}`);
                            log.push(`Backend Total: ${backendTotal}`);
                        }
                        if (frontendAttendedCount !== backendAttendedCount) {
                            log.push('\n[MISMATCH] Attended Counts differ!');
                            log.push(`Frontend Attended: ${frontendAttendedCount}`);
                            log.push(`Backend Attended: ${backendAttendedCount}`);
                        }

                        fs.writeFileSync('debug_result.txt', log.join('\n'));
                        console.log('Done.');
                    });
                });
            });
        });
    });
});
