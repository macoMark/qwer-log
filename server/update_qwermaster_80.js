const db = require('./db_adapter');

async function updateQwermaster() {
    console.log("Updating 'qwermaster' badge text to 80%...");

    await new Promise((resolve) => {
        const sql = `
            UPDATE badges 
            SET badge_condition = ?, badge_logic_memo = ?
            WHERE badge_code = ?
        `;
        const params = [
            '모든 일정의 80% 이상 참석',
            '모든 일정의 80% 이상 참석',
            'qwermaster'
        ];

        db.run(sql, params, function (err) {
            if (err) {
                console.error("Update failed:", err.message);
            } else {
                console.log(`Update complete. Changes: ${this.changes}`);
            }
            resolve();
        });
    });

    db.close();
}

updateQwermaster().catch(err => {
    console.error("Script error:", err);
    db.close();
});
