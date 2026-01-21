const db = require('./server/db_adapter');

const userId = 1;
const year = 2025;

db.all(
    "SELECT count(*) as count FROM attendance a JOIN events e ON a.event_id = e.id WHERE a.user_id = ? AND e.date LIKE ?",
    [userId, `${year}%`],
    (err, rows) => {
        if (err) console.error(err);
        else {
            const count = rows[0].count;
            console.log(`User ${userId} Event Count: ${count}`);
            let expected = 'None';
            if (count >= 30) expected = 'qwer-30';
            else if (count >= 10) expected = 'qwer-10';
            else if (count >= 1) expected = 'qwer-1';
            console.log(`Expected Badge: ${expected}`);
        }
        db.close();
    }
);
