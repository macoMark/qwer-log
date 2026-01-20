const db = require('./db_adapter');

console.log("Adding 'priority' column to badges table...");

const sql = `
    ALTER TABLE badges 
    ADD COLUMN priority INTEGER DEFAULT 999;
`;

db.run(sql, [], (err) => {
    if (err) {
        if (err.message.includes("duplicate column")) {
            console.log("Column 'priority' already exists.");
        } else {
            console.error("Error adding column:", err.message);
        }
    } else {
        console.log("Successfully added 'priority' column.");
    }
});
