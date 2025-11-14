// init-db.js
import { getDb } from './lib/db.js';

const setup = async () => {
    const db = await getDb();
    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    );
  `);
    console.log('Database ready');
    await db.close();
};

setup();
