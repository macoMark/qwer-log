const db = require('./db_adapter');

async function addBadge() {
    console.log("Adding 'yulyul-5' badge...");

    // Check if exists
    const exists = await new Promise((resolve) => {
        db.get("SELECT count(*) as count FROM badges WHERE badge_code = 'yulyul-5'", [], (err, row) => {
            if (err) {
                console.error("Error checking existence:", err);
                resolve(false);
            } else {
                resolve(row.count > 0);
            }
        });
    });

    if (exists) {
        console.log("'yulyul-5' already exists. Skipping insert.");
        db.close();
        return;
    }

    // Insert
    await new Promise((resolve) => {
        const sql = `
            INSERT INTO badges 
            (badge_code, badge_name, badge_condition, badge_detail, badge_logic_memo, badge_image_url, priority) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            'yulyul-5',
            '율율의 가호 Master',
            '추첨 이벤트 5회 이상 참석',
            '율율의 가호가 당신의 2025년을 가득 채웠습니다!',
            '획득한 tags가 draw >= 5',
            '/assets/badges/yulyul-5.png',
            249
        ];

        db.run(sql, params, function (err) {
            if (err) {
                console.error("Insert failed:", err.message);
            } else {
                console.log(`Insert complete. Changes: ${this.changes}`);
            }
            resolve();
        });
    });

    db.close();
}

addBadge().catch(err => {
    console.error("Script error:", err);
    db.close();
});
