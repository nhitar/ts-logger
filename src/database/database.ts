import sqlite3 from 'sqlite3';

import { DatabaseResponse } from '../common/interfaces/databaseResponseInterface';
import { log } from '../core/logger';

export class Database {
  databasePath: string;
  db: sqlite3.Database;

  constructor(databasePath: string) {
    this.databasePath = databasePath;
    this.db = new sqlite3.Database(this.databasePath);
  }

  run(request: string, params: unknown[] = []): Promise<DatabaseResponse> {
    return new Promise<DatabaseResponse>((resolve, reject) => {
      this.db.run(request, params, function (err) {
        if (err) {
          return reject(err);
        }
        resolve({
          lastID: this.lastID,
          changes: this.changes,
        });
      });
    });
  }

  get(request: string, params: unknown[] = []): Promise<unknown> {
    return new Promise<unknown>((resolve, reject) => {
      this.db.get(request, params, (err, row) => {
        if (err) {
          return reject(err);
        }
        resolve(row);
      });
    });
  }

  all(request: string, params: unknown[] = []): Promise<unknown[]> {
    return new Promise<unknown[]>((resolve, reject) => {
      this.db.all(request, params, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  async initDatabase() {
    try {
      await this.run('BEGIN TRANSACTION');
      await this.run(`
        CREATE TABLE IF NOT EXISTS currencies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          ticker TEXT NOT NULL,
          price REAL NOT NULL
        )
      `);

      await this.run(`
        CREATE TABLE IF NOT EXISTS currency_histories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          currency_id INTEGER NOT NULL,
          price REAL NOT NULL,
          timestamp DATETIME NOT NULL
        )
      `);

      await this.run(`
        CREATE TABLE IF NOT EXISTS wallets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          address TEXT NOT NULL UNIQUE
        )
      `);

      await this.run(`
        CREATE TABLE IF NOT EXISTS wallet_currencies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          wallet_id INTEGER NOT NULL,
          currency_id INTEGER NOT NULL,
          amount REAL NOT NULL
        )
      `);

      const isEmpty = await this.get(`SELECT * FROM currencies LIMIT 1`, []);
      if (isEmpty !== undefined) {
        log(
          'INFO',
          'Database already initialized with data. Skipping seeding.',
        );
        await this.run('COMMIT');
        return;
      }

      for (let i = 1; i <= 10; i++) {
        await this.run(
          `INSERT INTO currencies (name, ticker, price) VALUES (?, ?, ?)`,
          [`Currency ${i}`, `TICKER-${i}`, 1.0 * i],
        );
      }
      log('INFO', 'Database initialized and seeded with 10 currencies.');
      await this.run('COMMIT');
    } catch (error) {
      log('ERROR', `Error initializing database: ${error}`);
      await this.run('ROLLBACK');
      this.db.close();
    }
  }
}

export default new Database('db.sqlite3');
