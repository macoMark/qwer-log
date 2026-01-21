const db = require('./server/db_adapter');

db.all("SELECT badge_code FROM badges WHERE badge_code IN ('qwer-10', 'qwer-30', 'overseas-5', 'qwer-2', 'qwer-3', 'overseas-2')", [], (err, rows) => {
    if (err) console.error(err);
    else console.log('Current badges in DB:', rows);
    setTimeout(() => process.exit(0), 1000);
});
