import Store from './utils/Store';

export interface UpgradeMethod {
  (e: IDBVersionChangeEvent): void;
}
type StoreMap = Map<string, Store>;

interface DatabaseProps {
  name: string;
  version: number;
  upgradeMethod: UpgradeMethod;
}

interface GetStoreType {
  (storeMap: StoreMap, db: IDBDatabase | null, storeName: string | null): Store | null;
}

type Key = number | string;

export default class Database {
  private _name: string;
  private _version: number;
  private _db: IDBDatabase | null;
  private _upgradeMethod: UpgradeMethod | null;
  private _storeMap: StoreMap;

  static getStore: GetStoreType = (storeMap, db, storeName = null) => {
    if (db === null) return null;
    if (storeName === null) return null;
    if (storeMap.has(storeName) === false) storeMap.set(storeName, new Store({ db, name: storeName }));
    return storeMap.get(storeName) as Store;
  };

  constructor({ name, version, upgradeMethod }: DatabaseProps) {
    this._name = name;
    this._version = version;
    this._db = null;
    this._upgradeMethod = upgradeMethod || null;
    this._storeMap = new Map();
  }

  openDB(): Promise<void> {
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

  set(storeName: string, data: unknown): Promise<void> {
    const store = Database.getStore(this._storeMap, this._db, storeName);
    return store ? store.set(data) : Promise.reject(new Error('Please check the store name'));
  }

  get(storeName: string, key: Key): Promise<unknown> {
    const store = Database.getStore(this._storeMap, this._db, storeName);
    return store ? store.get(key) : Promise.reject(new Error('Please check the store name'));
  }

  getAll(storeName: string): Promise<Array<unknown>> {
    const store = Database.getStore(this._storeMap, this._db, storeName);
    return store ? store.getAll() : Promise.reject(new Error('Please check the store name'));
  }

  has(storeName: string, key: Key): Promise<boolean> {
    const store = Database.getStore(this._storeMap, this._db, storeName);
    return store ? store.has(key) : Promise.reject(new Error('Please check the store name'));
  }

  delete(storeName: string, key: Key): Promise<void> {
    const store = Database.getStore(this._storeMap, this._db, storeName);
    return store ? store.delete(key) : Promise.reject(new Error('Please check the store name'));
  }

  clear(storeName: string): Promise<void> {
    const store = Database.getStore(this._storeMap, this._db, storeName);
    return store ? store.clear() : Promise.reject(new Error('Please check the store name'));
  }
}
