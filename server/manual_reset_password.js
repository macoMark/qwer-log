const db = require('./db_adapter');
const crypto = require('crypto');

async function resetPassword(username, newPassword) {
    console.log(`Resetting password for user: ${username}`);

    const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');

    await new Promise((resolve) => {
        const sql = "UPDATE users SET password = ? WHERE username = ?";
        db.run(sql, [hashedPassword, username], function (err) {
            if (err) {
                console.error("Password update failed:", err.message);
            } else {
                if (this.changes > 0) {
                    console.log(`Password updated successfully for '${username}'.`);
                } else {
                    console.log(`User '${username}' not found.`);
                }
            }
            resolve();
        });
    });

    db.close();
}

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
    console.log("Usage: node server/manual_reset_password.js <username> <new_password>");
    db.close();
} else {
    resetPassword(username, password).catch(err => {
        console.error("Script error:", err);
        db.close();
    });
}
