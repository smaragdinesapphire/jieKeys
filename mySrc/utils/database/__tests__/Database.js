import 'fake-indexeddb/auto';
import Database from '../Database.ts';

describe('測試 Database', () => {
  const DB_NAME = 'test_DB';
  const STORE_NAME = 'test_store';

  const database = new Database({
    name: DB_NAME,
    version: 1,
    upgradeMethod: e => {
      const store = e.target.result.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      store.createIndex('name', 'name', { unique: false });
      store.createIndex('year', 'year', { unique: false });
    },
  });

  afterEach(async done => {
    await database.clear(STORE_NAME);
    done();
  });

  test('openDB', () => {
    return expect(database.openDB()).resolves.toBe(undefined);
  });

  test('set & get, exsit', async () => {
    const ans = { id: 1, name: 'name1', year: 1 };
    await database.set(STORE_NAME, ans);
    await expect(database.get(STORE_NAME, 1)).resolves.toEqual(ans);
  });

  test('set & get, non-exsit', async () => {
    const ans = { id: 1, name: 'name1', year: 1 };
    await database.set(STORE_NAME, ans);
    await expect(database.get(STORE_NAME, 2)).resolves.toBe();
  });

  test('getAll', async () => {
    const ans1 = { id: 1, name: 'name1', year: 1 };
    const ans2 = { id: 2, name: 'name2', year: 2 };
    await database.set(STORE_NAME, ans1);
    await database.set(STORE_NAME, ans2);
    await expect(database.getAll(STORE_NAME)).resolves.toEqual([ans1, ans2]);
  });

  test('clear', async () => {
    const ans = { id: 1, name: 'name1', year: 1 };
    await database.set(STORE_NAME, ans);
    await database.clear(STORE_NAME);
    await expect(database.getAll(STORE_NAME)).resolves.toEqual([]);
  });

  test('delete', async () => {
    const ans1 = { id: 1, name: 'name1', year: 1 };
    const ans2 = { id: 2, name: 'name2', year: 2 };
    await database.set(STORE_NAME, ans1);
    await database.set(STORE_NAME, ans2);
    await database.delete(STORE_NAME, 1);
    await expect(database.getAll(STORE_NAME)).resolves.toEqual([ans2]);
  });

  test('has', async () => {
    const ans1 = { id: 1, name: 'name1', year: 1 };
    const ans2 = { id: 2, name: 'name2', year: 2 };
    await database.set(STORE_NAME, ans1);
    await database.set(STORE_NAME, ans2);
    await database.delete(STORE_NAME, 1);
    await expect(database.has(STORE_NAME, 1)).resolves.toBe(false);
    await expect(database.has(STORE_NAME, 2)).resolves.toBe(true);
  });
});
