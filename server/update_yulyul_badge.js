const db = require('./db_adapter');

async function updateBadge() {
    console.log("Updating 'yulyul' badge to 'yulyul-1'...");

    // Check if yulyul exists
    await new Promise((resolve) => {
        db.get("SELECT count(*) as count FROM badges WHERE badge_code = 'yulyul'", [], (err, row) => {
            if (err) {
                console.error("Error checking yulyul:", err);
            } else {
                console.log(`Found ${row.count} records for 'yulyul'.`);
            }
            resolve();
        });
    });

    // Update
    await new Promise((resolve) => {
        const sql = "UPDATE badges SET badge_code = 'yulyul-1', badge_image_url = '/assets/badges/yulyul-1.png' WHERE badge_code = 'yulyul'";
        db.run(sql, [], function (err) {
            if (err) {
                console.error("Update failed:", err.message);
            } else {
                console.log(`Update complete. Changes: ${this.changes}`);
            }
            resolve();
        });
    });

    // Verification
    await new Promise((resolve) => {
        db.get("SELECT * FROM badges WHERE badge_code = 'yulyul-1'", [], (err, row) => {
            if (err) {
                console.error("Verify failed:", err);
            } else if (row) {
                console.log("Verification SUCCESS: Found 'yulyul-1' badge.");
                console.log(row);
            } else {
                console.log("Verification FAILED: 'yulyul-1' not found (maybe yulyul didn't exist?).");
            }
            resolve();
        });
    });

    db.close();
}

updateBadge().catch(err => {
    console.error("Script error:", err);
    db.close();
});
