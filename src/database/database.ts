import sqlite3 from 'sqlite3';

export class Database {
  databasePath: string;
  db: sqlite3.Database;

  constructor(databasePath: string) {
    this.databasePath = databasePath;
    this.db = new sqlite3.Database(this.databasePath);
  }

  run(request: string, params: unknown[] = []): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.run(request, params, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  get(request: string, params: unknown[] = []): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.db.get(request, params, (err, row) => {
        if (err) {
          return reject(err);
        }
        resolve(row);
      });
    });
  }

  all(request: string, params: unknown[] = []): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
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

      const isEmpty = await this.get(`SELECT * FROM currencies LIMIT 1`, []);
      if (isEmpty !== undefined) {
        console.log(
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
      console.log('Database initialized and seeded with 10 currencies.');
      await this.run('COMMIT');
    } catch (error) {
      console.error('Error initializing database:', error);
      await this.run('ROLLBACK');
      this.db.close();
    }
  }
}

export default new Database('db.sqlite3');
