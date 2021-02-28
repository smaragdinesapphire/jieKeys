import TriggerEventManager from './triggerEventManager/TriggerEventManager';
import HandleEventManager from './handleEventManager/HandleEventManager';
import getEventPosition from '../getEventPosition/getEventPosition';
import checkInsideElement from '../checkInsideElement/checkInsideElement';

const MATERIAL_EVENT = {
  mousedown: ['mousedown', 'touchstart'],
  mouseup: ['mouseup', 'touchend'],
  click: ['click', 'touchstart', 'touchend', 'touchmove'],
  contextmenu: ['contextmenu', 'touchstart', 'touchend'],
  mousemove: ['mousemove', 'touchmove'],
};

const CONTEXT_MENU_TIME = 1000;
const CONTEXT_MENU_MOVE_LIMIT_PIXEL = 3 ** 2;

export default class TouchEventConverter {
  constructor(target) {
    this.target = target;
    this.triggerEventManager = new TriggerEventManager(); // user 訂閱的事件
    this.handleEventManager = new HandleEventManager(); // 向 dom 訂閱的事件
    this.record = {
      position: { clientX: 0, clientY: 0 },
      start: false,
      showContextMenu: false,
      timerId: null,
    };
  }

  validTarget() {
    return this.target.addEventListener !== undefined;
  }

  triggerEvent(eventName, e) {
    [false, true].forEach(useCapture => {
      if (this.handleEventManager.has(eventName, useCapture)) this.triggerEventManager.action(eventName, useCapture, e);
    });
  }

  handleTouchStart(e) {
    const hasClick = this.handleEventManager.has('click', true) || this.handleEventManager.has('click', false);
    const hasContextMenu =
      this.handleEventManager.has('contextmenu', true) || this.handleEventManager.has('contextmenu', false);

    this.record = {
      ...this.record,
      position: hasClick || hasContextMenu ? getEventPosition(e) : this.record.position,
      timerId: hasContextMenu
        ? setTimeout(() => {
            const { start } = this.record;
            if (start) {
              this.record.showContextMenu = true;
              this.record.timerId = null;
            } else this.record.timerId = null;
          }, CONTEXT_MENU_TIME)
        : null,
      start: hasClick || hasContextMenu,
    };
  }

  handleTouchEnd(e) {
    const { showContextMenu, start } = this.record;
    if (start) {
      this.record = { ...this.record, start: false };
      if (checkInsideElement(e, this.target)) this.triggerEvent('mousedown', e);
    }
    if (showContextMenu) {
      this.triggerEvent('contextmenu', e);
      this.record = { ...this.record, showContextMenu: false, start: false };
    }
  }

  handleTouchMove(e) {
    const { start } = this.record;
    if (start) {
      if (this.handleEventManager.has('contextmenu', true) || this.handleEventManager.has('contextmenu', false)) {
        if (checkInsideElement(e, this.target)) {
          const {
            position: { clientX, clientY },
            timerId,
          } = this.record;
          const position = getEventPosition(e);
          const moveX = position.clientX - clientX;
          const moveY = position.clientY - clientY;

          if (Math.abs(moveY) ** 2 + Math.abs(moveX) ** 2 > CONTEXT_MENU_MOVE_LIMIT_PIXEL) {
            // 超過移動範圍，清除 contextmenu
            this.record = { ...this.record, showContextMenu: false, timerId: null };
            clearTimeout(timerId);
          }
        } else this.record = { ...this.record, showContextMenu: false };
      }
    }
    this.triggerEvent('mousemove', e);
  }

  handleMaterialEvent(eventName, useCapture) {
    MATERIAL_EVENT[eventName].forEach(name => {
      if (this.handleEventManager.has(name, useCapture) === false) {
        let eventHandler;
        if (/touch/.test(name))
          eventHandler = e => {
            e.preventDefault();

            switch (name) {
              case 'touchstart':
                this.handleTouchStart(e);
                break;
              case 'touchend':
                this.handleTouchEnd(e);
                break;
              case 'touchmove':
                this.handleTouchMove(e);
                break;
              // no default
            }

            this.triggerEventManager.action(eventName, useCapture, e);
          };
        else eventHandler = e => this.triggerEventManager.action(eventName, useCapture, e);
        this.target.addEventListener(eventName, eventHandler, useCapture);
      }
    });
  }

  addEventListener(eventName, fn, useCapture = false) {
    if (this.validTarget()) {
      const success = this.triggerEventManager.add(eventName, fn, useCapture);
      if (success) {
        if (this.handleEventManager.has(eventName, useCapture) === false) {
          if (MATERIAL_EVENT[eventName]) this.handleMaterialEvent(eventName, useCapture);
          else {
            const eventHandler = e => this.triggerEventManager.action(eventName, useCapture, e);
            this.target.addEventListener(eventName, eventHandler, useCapture);
          }
        }
      }
    }
  }

  removeEventListener(eventName, fn, useCapture = false) {
    if (this.validTarget()) {
      this.triggerEventManager.delete(eventName, fn, useCapture);

      // 清除已經不需要的 event handler
      if (this.triggerEventManager.has(eventName, useCapture) === false) {
        if (MATERIAL_EVENT[eventName]) {
          const onlineEventMap = Object.keys(MATERIAL_EVENT)
            .filter(eventKey => this.triggerEventManager.has(eventKey, useCapture) === true)
            .reduce((map, eventKey) => {
              MATERIAL_EVENT[eventKey].forEach(item => {
                if (map.has(item) === false) map.set(item, item);
              });
              return map;
            }, new Map());
          MATERIAL_EVENT[eventName].forEach(item => {
            if (onlineEventMap.has(item) === false) this.handleEventManager.delete(item, useCapture);
          });
        } else this.handleEventManager.delete(eventName, useCapture);
      }
    }
  }
}
