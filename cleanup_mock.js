require('dotenv').config();
const db = require('./server/db_adapter');

console.log('Cleaning up mock data...');

const sql = `DELETE FROM events WHERE title LIKE 'Mock Anni%' OR (id >= 901 AND id <= 905);`;

db.run(sql, [], (err) => {
    if (err) {
        console.error('Error deleting mock data:', err);
    } else {
        console.log('Successfully deleted mock events.');

        // Use a timeout to allow the async operation to likely complete, 
        // confirming with a select would be better but this is simple cleanup.
        db.all("SELECT * FROM events WHERE title LIKE 'Mock Anni%'", [], (err, rows) => {
            if (err) console.error('Verification error:', err);
            else console.log('Remaining Mock Events:', rows.length);

            // Exit after a brief pause
            setTimeout(() => process.exit(0), 1000);
        });
    }
});
