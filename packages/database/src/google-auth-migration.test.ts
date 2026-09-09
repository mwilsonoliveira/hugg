import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createClient } from '@libsql/client';

// Rebuild of User must retain hashes and all foreign-key relationships.
test('Google migration preserves users, pets and adoptions', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'hugg-migration-'));
  const db = createClient({ url: `file:${directory}/test.db` });
  try {
    const sql = await readFile(new URL('../prisma/migrations/20260829000000_init/migration.sql', import.meta.url), 'utf8');
    await db.migrate(sql.split('--> statement-breakpoint').filter(s => s.trim()));
    await db.execute("INSERT INTO User (id,name,email,passwordHash,updatedAt) VALUES ('u','User','u@test.com','existing-hash',CURRENT_TIMESTAMP)");
    await db.execute("INSERT INTO Pet (id,species,situation,waitingSince,createdById,updatedAt) VALUES ('p','DOG','SHELTER',CURRENT_TIMESTAMP,'u',CURRENT_TIMESTAMP)");
    await db.execute("INSERT INTO Adoption (id,petId,userId,updatedAt) VALUES ('a','p','u',CURRENT_TIMESTAMP)");
    const migration = await readFile(new URL('../prisma/migrations/20260908000000_google_auth/migration.sql', import.meta.url), 'utf8');
    await db.migrate(migration.split('--> statement-breakpoint').filter(s => s.trim()));
    assert.equal((await db.execute('SELECT passwordHash FROM User WHERE id = \'u\'')).rows[0]?.passwordHash, 'existing-hash');
    assert.equal((await db.execute('SELECT COUNT(*) AS total FROM Adoption')).rows[0]?.total, 1);
    assert.equal((await db.execute('PRAGMA foreign_key_check')).rows.length, 0);
    await db.execute("INSERT INTO User (id,name,email,googleSubject,updatedAt) VALUES ('g','Google','g@test.com','sub',CURRENT_TIMESTAMP)");
    assert.equal((await db.execute("SELECT passwordHash FROM User WHERE id='g'")).rows[0]?.passwordHash, null);
    await assert.rejects(db.execute("INSERT INTO User (id,name,email,googleSubject,updatedAt) VALUES ('g2','Google','g2@test.com','sub',CURRENT_TIMESTAMP)"));
  } finally { db.close(); await rm(directory, { recursive: true, force: true }); }
});
