require('dotenv').config();
const db = require('./server/db_adapter');

async function migrate() {
    console.log('Migrating badges to semantic numeric codes...');

    const updates = [
        { old: 'qwer-2', newCode: 'qwer-10', newImg: '/assets/badges/qwer-10.png' },
        { old: 'qwer-3', newCode: 'qwer-30', newImg: '/assets/badges/qwer-30.png' },
        { old: 'overseas-2', newCode: 'overseas-5', newImg: '/assets/badges/overseas-5.png' }
    ];

    for (const u of updates) {
        await new Promise((resolve) => {
            const sql = `UPDATE badges SET badge_code = ?, badge_image_url = ? WHERE badge_code = ?`;
            db.run(sql, [u.newCode, u.newImg, u.old], (err) => {
                if (err) console.error(`Error updating ${u.old}:`, err.message);
                else {
                    console.log(`Updated ${u.old} -> ${u.newCode}`);
                }
                resolve();
            });
        });
    }

    console.log('Migration complete.');
    // Verify changes
    db.all("SELECT badge_code, badge_image_url FROM badges WHERE badge_code IN ('qwer-10', 'qwer-30', 'overseas-5')", [], (err, rows) => {
        if (err) console.error('Verification error:', err);
        else console.log('Verified updated badges:', rows);
        setTimeout(() => process.exit(0), 1000);
    });
}

migrate();
