const { exec } = require('child_process');

exec('netstat -ano | findstr :3001', (err, stdout, stderr) => {
    if (err) return;
    const lines = stdout.trim().split('\n');
    lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && /^\d+$/.test(pid)) {
            console.log(`Killing PID ${pid}`);
            exec(`taskkill /F /PID ${pid}`);
        }
    });
});
