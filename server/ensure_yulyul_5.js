const db = require('./db_adapter');

async function ensureBadge() {
    console.log("Ensuring 'yulyul-5' badge...");

    // 1. Try UPDATE first
    const updated = await new Promise((resolve) => {
        const sql = `
            UPDATE badges 
            SET badge_name = ?, badge_condition = ?, badge_detail = ?, badge_logic_memo = ?, badge_image_url = ?, priority = ?
            WHERE badge_code = ?
        `;
        const params = [
            '율율의 가호 Master',
            '추첨 이벤트 5회 이상 참석',
            '율율의 가호가 당신의 2025년을 가득 채웠습니다!',
            '획득한 tags가 draw >= 5',
            '/assets/badges/yulyul-5.png',
            249,
            'yulyul-5'
        ];

        db.run(sql, params, function (err) {
            if (err) {
                console.error("Update error:", err.message);
                resolve(false);
            } else {
                console.log(`Update attempt changes: ${this.changes}`);
                resolve(this.changes > 0);
            }
        });
    });

    if (updated) {
        console.log("'yulyul-5' updated successfully.");
        db.close();
        return;
    }

    // 2. If update didn't match, INSERT
    console.log("'yulyul-5' not found via UPDATE. Attempting INSERT...");
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

ensureBadge().catch(err => {
    console.error("Script error:", err);
    db.close();
});
