/**
 * 層級關係
 * event map
 *    useCapture map
 *      function map
 */
export default class TriggerEventManager {
  static validEventName = eventName => typeof eventName === 'string' && eventName !== '';

  constructor() {
    this.eventMap = new Map();
  }

  has(eventName, useCapture = false) {
    if (this.eventMap.has(eventName)) {
      const useCaptureMap = this.eventMap.get(eventName);
      return useCaptureMap.has(useCapture);
    }
    return false;
  }

  add(eventName, fn, useCapture = false) {
    if (TriggerEventManager.validEventName(eventName)) {
      if (this.eventMap.has(eventName) === false) this.eventMap.set(eventName, new Map());

      const useCaptureMap = this.eventMap.get(eventName);
      if (useCaptureMap.has(useCapture) === false) useCaptureMap.set(useCapture, new Map());

      const fnMap = useCaptureMap.get(useCapture);
      fnMap.set(fn, fn);
      return true;
    }
    return false;
  }

  delete(eventName, fn, useCapture) {
    if (TriggerEventManager.validEventName(eventName)) {
      if (this.eventMap.has(eventName) === true) {
        const useCaptureMap = this.eventMap.get(eventName);
        if (useCaptureMap.has(useCapture) === true) {
          const fnMap = useCaptureMap.get(useCapture);
          fnMap.delete(fn);

          if (fnMap.size === 0) useCaptureMap.delete(useCapture);
          if (useCaptureMap.size === 0) this.eventMap.delete(eventName);
        }
      }
    }
  }

  action(eventName, useCapture, event) {
    if (this.eventMap.has(eventName) === true) {
      const useCaptureMap = this.eventMap.get(eventName);
      if (useCaptureMap.has(useCapture) === true) {
        const fnMap = useCaptureMap.get(useCapture);
        fnMap.forEach(fn => fn(event));
      }
    }
  }
}
