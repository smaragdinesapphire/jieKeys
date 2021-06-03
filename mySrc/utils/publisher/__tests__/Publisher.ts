import Publisher from '../Publisher';

describe('測試 Publisher', () => {
  interface CallbackFunction {
    (props: Array<unknown>): void;
  }

  class P extends Publisher {
    _subscribers: Array<CallbackFunction>;

    constructor() {
      super();
      this._subscribers = [];
    }
  }

  const fn1 = (arr: Array<string>): void => {
    console.log(arr);
  };

  const fn2 = (arr: Array<string>): void => {
    console.log(arr);
  };

  let onEventFire;
  beforeEach(() => (onEventFire = new P()));

  test('subscribe - 單一', () => {
    onEventFire.subscribe(fn1);
    expect(onEventFire._subscribers[0]).toEqual(fn1);
  });

  test('subscribe - 複數', () => {
    onEventFire.subscribe(fn1);
    onEventFire.subscribe(fn2);
    expect(onEventFire._subscribers.length).toEqual(2);
    expect(onEventFire._subscribers[0]).toEqual(fn1);
    expect(onEventFire._subscribers[1]).toEqual(fn2);
  });

  test('subscribe - 重複', () => {
    onEventFire.subscribe(fn1);
    onEventFire.subscribe(fn1);
    expect(onEventFire._subscribers.length).toEqual(1);
    expect(onEventFire._subscribers[0]).toEqual(fn1);
  });

  test('unsubscribe - 單個 fn', () => {
    onEventFire.subscribe(fn1);
    onEventFire.subscribe(fn2);
    onEventFire.unsubscribe(fn1);

    expect(onEventFire._subscribers.length).toEqual(1);
    expect(onEventFire._subscribers[0]).toEqual(fn2);
  });

  test('unsubscribe - 數個 fn', () => {
    onEventFire.subscribe(fn1);
    onEventFire.subscribe(fn2);
    onEventFire.unsubscribe(fn1);
    onEventFire.unsubscribe(fn2);

    expect(onEventFire._subscribers.length).toEqual(0);
  });

  test('unsubscribe - 數個 fn', () => {
    onEventFire.subscribe(fn1);
    onEventFire.subscribe(fn2);
    onEventFire.unsubscribeAll();

    expect(onEventFire._subscribers.length).toEqual(0);
  });

  test('publish - 單個', () => {
    const ans = {};
    let result = null;
    const fn = (arr: Array<string>): void => {
      [result] = arr;
    };
    onEventFire.subscribe(fn);
    onEventFire.publish(ans);
    expect(result).toEqual(ans);
  });

  test('publish - 數個', () => {
    const ans = {};
    const result = [];
    const fnA = (arr: Array<string>): void => {
      result.push(arr[0]);
    };
    const fnB = (arr: Array<string>): void => {
      result.push(arr[0]);
    };
    onEventFire.subscribe(fnA);
    onEventFire.subscribe(fnB);
    onEventFire.publish(ans);
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual(ans);
    expect(result[1]).toEqual(ans);
  });
});
