require('dotenv').config();
console.log('Env Keys:', Object.keys(process.env).filter(k => k.includes('URL') || k.includes('KEY')));

const db = require('./server/db_adapter');

console.log('Seeding data...');

// 1. Update Badge Metadata
const badgeSql = `
    INSERT INTO badges (badge_code, badge_name, description, badge_image_url, priority) 
    VALUES ('anni-0', 'Anniversary Bronze', '생일, 2주년 이벤트 카페 2개 이상 참석', '/images/badges/anni-0.png', 7) 
    ON CONFLICT(badge_code) DO NOTHING; 
    UPDATE badges SET badge_name='Anniversary Silver', description='생일, 2주년 이벤트 카페 4개 이상 참석' WHERE badge_code='anni-1';
`;

db.run(badgeSql, [], (err) => {
    if (err) console.error('Badge Seed Error:', err);
    else {
        console.log('Badges seeded command sent.');
        // Verify immediately
        db.all("SELECT * FROM badges WHERE badge_code LIKE 'anni%'", [], (err, rows) => {
            if (err) console.error('Verify Error:', err);
            else console.log('VERIFY_BADGES:', JSON.stringify(rows, null, 2));
        });
    }
});

// 2. Insert Mock Events
const values = [
    [901, 'Mock Anni 1', '2025-02-01', 'anniversary', JSON.stringify(['anniversary'])],
    [902, 'Mock Anni 2', '2025-02-02', 'anniversary', JSON.stringify(['anniversary'])],
    [903, 'Mock Anni 3', '2025-02-03', 'anniversary', JSON.stringify(['anniversary'])],
    [904, 'Mock Anni 4', '2025-02-04', 'anniversary', JSON.stringify(['anniversary'])],
    [905, 'Mock Anni 5', '2025-02-05', 'anniversary', JSON.stringify(['anniversary'])]
];

let completed = 0;
values.forEach(v => {
    const sql = "INSERT INTO events (id, title, date, type, tags) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING";
    db.run(sql, v, (err) => {
        if (err) console.error('Event Seed Error:', err);
        completed++;
        if (completed === values.length) {
            console.log('Events seeded successfully');
            // Give it a second
            setTimeout(() => {
                // Check events
                db.all("SELECT * FROM events WHERE id > 900", [], (err, rows) => {
                    console.log('VERIFY_EVENTS:', JSON.stringify(rows, null, 2));
                    process.exit(0);
                });
            }, 2000);
        }
    });
});
