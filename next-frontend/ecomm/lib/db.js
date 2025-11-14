import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

export async function getDb(dbName) {
    const dbPath = path.join(process.cwd(), "data", dbName);
    return open({
        filename: dbPath,
        driver: sqlite3.Database,
    });
}
