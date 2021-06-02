interface CallbackFunction {
  (props: Array<unknown>): void;
}

export default class Publisher {
  protected _subscribers: Array<CallbackFunction>;

  constructor() {
    this._subscribers = [];
  }

  subscribe(fn: CallbackFunction): void {
    if (typeof fn === 'function' && this._subscribers.includes(fn) === false) this._subscribers.push(fn);
  }

  unsubscribe(fn: CallbackFunction): void {
    this._subscribers = this._subscribers.filter(subscriber => subscriber !== fn);
  }

  unsubscribeAll(): void {
    this._subscribers.length = 0;
  }

  publish(...rest: unknown[]): void {
    this._subscribers.forEach(subscriber => subscriber(rest));
  }
}
