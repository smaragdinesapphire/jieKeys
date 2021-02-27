/**
 * 層級關係
 * event map
 *    useCapture map
 */
export default class HandleEventManager {
  static validEventName = eventName => typeof eventName === 'string' && eventName !== '';

  constructor() {
    this.eventMap = new Map();
  }

  set(eventName, useCapture = false) {
    if (HandleEventManager.validEventName(eventName)) {
      if (this.eventMap.has(eventName) === false) this.eventMap.set(eventName, new Map());

      const useCaptureMap = this.eventMap.get(eventName);
      if (useCaptureMap.has(useCapture) === false) useCaptureMap.set(useCapture, true);
      return true;
    }
    return false;
  }

  delete(eventName, useCapture) {
    if (HandleEventManager.validEventName(eventName)) {
      if (this.eventMap.has(eventName) === true) {
        const useCaptureMap = this.eventMap.get(eventName);
        if (useCaptureMap.has(useCapture) === true) {
          useCaptureMap.delete(useCapture);
        }
      }
    }
  }

  has(eventName, useCapture) {
    if (this.eventMap.has(eventName) === true) {
      const useCaptureMap = this.eventMap.get(eventName);
      return useCaptureMap.has(useCapture) === true;
    }
    return false;
  }
}
