import Store from './utils/Store';

export default class Database {
  static getStore(storeName = null) {
    if (storeName !== null) {
      if (this._storeMap.has(storeName) === false)
        this._storeMap.set(storeName, new Store({ db: this._db, name: storeName }));
      return this._storeMap.get(storeName);
    }
    return null;
  }

  constructor({ name, version, upgradeMethod }) {
    this._name = name;
    this._version = version;
    this._db = null;
    this._upgradeMethod = upgradeMethod || null;
    this._storeMap = new Map();
  }

  openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this._name, this._version);
      req.onsuccess = () => {
        this._db = req.result;
        resolve();
      };
      req.onerror = () => reject(req.error);
      req.onupgradeneeded = this._upgradeMethod;
    });
  }

  set(storeName, data) {
    const store = Database.getStore.call(this, storeName);
    return store ? store.set(data) : Promise.reject(new Error('Plese check the store name'));
  }

  get(storeName, key) {
    const store = Database.getStore.call(this, storeName);
    return store ? store.get(key) : Promise.reject(new Error('Plese check the store name'));
  }

  getAll(storeName) {
    const store = Database.getStore.call(this, storeName);
    return store ? store.getAll() : Promise.reject(new Error('Plese check the store name'));
  }

  has(storeName, key) {
    const store = Database.getStore.call(this, storeName);
    return store ? store.has(key) : Promise.reject(new Error('Plese check the store name'));
  }

  delete(storeName, key) {
    const store = Database.getStore.call(this, storeName);
    return store ? store.delete(key) : Promise.reject(new Error('Plese check the store name'));
  }

  clear(storeName) {
    const store = Database.getStore.call(this, storeName);
    return store ? store.clear() : Promise.reject(new Error('Plese check the store name'));
  }
}
