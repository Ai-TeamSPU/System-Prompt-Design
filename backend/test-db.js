const mysql = require('mysql2/promise');

async function testConnection(host, password) {
    try {
        const connection = await mysql.createConnection({
            host: host,
            user: 'root',
            password: password,
            database: 'vibe_prompt_db',
            port: 4306
        });
        console.log(`[SUCCESS] Connected to ${host} with password '${password}'`);
        await connection.end();
        return true;
    } catch (err) {
        console.log(`[FAIL] Connected to ${host} with password '${password}' - ${err.message}`);
        return false;
    }
}

async function run() {
    const combos = [
        { host: 'localhost', pass: '' },
        { host: 'localhost', pass: '12345678' },
        { host: 'localhost', pass: '123456789' },
        { host: '127.0.0.1', pass: '' },
        { host: '127.0.0.1', pass: '12345678' },
        { host: '127.0.0.1', pass: '123456789' }
    ];

    for (const c of combos) {
        await testConnection(c.host, c.pass);
    }
}

run();
