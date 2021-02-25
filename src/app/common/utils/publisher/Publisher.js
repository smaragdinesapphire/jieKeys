export default class Publisher {
  constructor() {
    this.subscribers = [];
  }

  subscribe(fn) {
    if (typeof fn === 'function') this.subscribers.push(fn);
  }

  unsubscribe(fn) {
    this.subscribers = this.subscribers.filter(subscriber => subscriber !== fn);
  }

  unsubscribeAll() {
    this.subscribers.length = 0;
  }

  publish(...rest) {
    this.subscribers.forEach(subscriber => subscriber(...rest));
  }
}
