const fs = require('fs');

try {
    // Try reading as utf8 first, if it looks wrong, we might try ucs2
    // But typically simply reading without encoding and converting to string helps
    // checking first bytes.
    const buffer = fs.readFileSync('server_debug.log');
    // Check BOM
    let content;
    if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
        content = buffer.toString('ucs2'); // UTF-16LE
    } else {
        content = buffer.toString('utf8');
    }
    console.log(content);
} catch (err) {
    console.error(err);
}
