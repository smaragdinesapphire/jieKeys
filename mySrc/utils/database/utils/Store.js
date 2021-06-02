export default class Store {
  static getObjectStore({ db, storeName, mode }) {
    const tx = db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  constructor({ db, name }) {
    this._name = name;
    this._db = db;
  }

  set(data) {
    const store = Store.getObjectStore({ db: this._db, storeName: this._name, mode: 'readwrite' });
    return new Promise((resolve, reject) => {
      try {
        const req = store.put(data);
        req.onsuccess = () => {
          resolve();
        };
        // req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  get(key) {
    const store = Store.getObjectStore({ db: this._db, storeName: this._name, mode: 'readonly' });
    return new Promise((resolve, reject) => {
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  getAll() {
    return new Promise(resolve => {
      const datas = [];
      const store = Store.getObjectStore({ db: this._db, storeName: this._name, mode: 'readonly' });
      store.openCursor().addEventListener('success', event => {
        const cursor = event.target.result;
        if (cursor) {
          datas.push(cursor.value);
          cursor.continue();
        } else {
          resolve(JSON.stringify(datas));
        }
      });
    });
  }

  has(key) {
    return new Promise((resolve, reject) => {
      const store = Store.getObjectStore({ db: this._db, storeName: this._name, mode: 'readonly' });
      const req = store.count(IDBKeyRange.only(key));
      req.onsuccess = () => resolve(req.result !== 0);
      req.onerror = () => reject(req.error);
    });
  }

  delete(key) {
    return new Promise((resolve, reject) => {
      // As per spec http://www.w3.org/TR/IndexedDB/#object-store-deletion-operation
      // the result of the Object Store Deletion Operation algorithm is
      // undefined, so it's not possible to know if some records were actually
      // deleted by looking at the request result.
      this.get(key)
        .then(() => {
          const store = Store.getObjectStore({ db: this._db, storeName: this._name, mode: 'readwrite' });
          const req = store.delete(key);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        })
        .catch(e => reject(e));
    });
  }

  clear() {
    return new Promise((resolve, reject) => {
      const store = Store.getObjectStore({ db: this._db, storeName: this._name, mode: 'readwrite' });
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}
