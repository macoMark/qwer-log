require('dotenv').config();
const db = require('./server/db_adapter');

console.log('Force cleaning up mock data...');

// 1. Delete Attendance records referencing the mock events first
const deleteAttendanceSql = `
    DELETE FROM attendance 
    WHERE event_id IN (
        SELECT id FROM events 
        WHERE title LIKE 'Mock Anni%' OR (id >= 901 AND id <= 905)
    );
`;

db.run(deleteAttendanceSql, [], (err) => {
    if (err) {
        console.error('Error deleting attendance records:', err);
        process.exit(1);
    } else {
        console.log('Successfully deleted related attendance records.');

        // 2. Now delete the events
        const deleteEventsSql = `
            DELETE FROM events 
            WHERE title LIKE 'Mock Anni%' OR (id >= 901 AND id <= 905);
        `;

        db.run(deleteEventsSql, [], (err) => {
            if (err) {
                console.error('Error deleting mock events:', err);
            } else {
                console.log('Successfully deleted mock events.');

                // Verification
                db.all("SELECT count(*) as count FROM events WHERE title LIKE 'Mock Anni%'", [], (err, rows) => {
                    if (err) console.error('Verification error:', err);
                    else console.log('Remaining Mock Events:', rows[0].count);

                    setTimeout(() => process.exit(0), 1000);
                });
            }
        });
    }
});
