import UserHandleEventManager from './userHandleEventManager/UserHandleEventManager';
import DomHandleEventManager from './domHandleEventManager/DomHandleEventManager';
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
    this.userHandleEventManager = new UserHandleEventManager(); // user 訂閱的事件
    this.domHandleEventManager = new DomHandleEventManager(); // 向 dom 訂閱的事件
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
      if (this.domHandleEventManager.has(eventName, useCapture))
        this.userHandleEventManager.action(eventName, useCapture, e);
    });
  }

  handleTouchStart(e, useCapture) {
    const hasClick = this.domHandleEventManager.has('click', true) || this.domHandleEventManager.has('click', false);
    const hasContextMenu =
      this.domHandleEventManager.has('contextmenu', true) || this.domHandleEventManager.has('contextmenu', false);

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

    this.userHandleEventManager.action('mousedown', useCapture, e);
  }

  handleTouchEnd(e, useCapture) {
    const { showContextMenu, start } = this.record;
    if (start) {
      this.record = { ...this.record, start: false };
      if (checkInsideElement(e, this.target)) this.triggerEvent('mousedown', e);
    }
    if (showContextMenu) {
      this.triggerEvent('contextmenu', e);
      this.record = { ...this.record, showContextMenu: false, start: false };
    }
    this.userHandleEventManager.action('mouseup', useCapture, e);
  }

  handleTouchMove(e) {
    const { start } = this.record;
    if (start) {
      if (this.domHandleEventManager.has('contextmenu', true) || this.domHandleEventManager.has('contextmenu', false)) {
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
      if (this.domHandleEventManager.has(name, useCapture) === false) {
        let eventHandler;
        if (/touch/.test(name))
          eventHandler = e => {
            e.preventDefault();

            switch (name) {
              case 'touchstart':
                this.handleTouchStart(e, useCapture);
                break;
              case 'touchend':
                this.handleTouchEnd(e, useCapture);
                break;
              case 'touchmove':
                this.handleTouchMove(e);
                break;
              // no default
            }
          };
        else eventHandler = e => this.userHandleEventManager.action(name, useCapture, e);
        this.target.addEventListener(name, eventHandler, useCapture);
        this.domHandleEventManager.set(eventName, useCapture, eventHandler);
      }
    });
  }

  addEventListener(eventName, fn, useCapture = false) {
    if (this.validTarget()) {
      const success = this.userHandleEventManager.add(eventName, fn, useCapture);
      if (success) {
        if (this.domHandleEventManager.has(eventName, useCapture) === false) {
          if (MATERIAL_EVENT[eventName]) this.handleMaterialEvent(eventName, useCapture);
          else {
            const eventHandler = e => this.userHandleEventManager.action(eventName, useCapture, e);
            this.target.addEventListener(eventName, eventHandler, useCapture);
            this.domHandleEventManager.set(eventName, useCapture, eventHandler);
          }
        }
      }
    }
  }

  removeEventListener(eventName, fn, useCapture = false) {
    if (this.validTarget()) {
      this.userHandleEventManager.delete(eventName, fn, useCapture);

      // 清除已經不需要的 event handler
      if (this.userHandleEventManager.has(eventName, useCapture) === false) {
        const deleteList = [];
        if (MATERIAL_EVENT[eventName]) {
          const onlineEventList = Object.keys(MATERIAL_EVENT)
            .filter(name => this.userHandleEventManager.has(name, useCapture) === true)
            .reduce((arr, name) => {
              MATERIAL_EVENT[name].forEach(item => {
                if (arr.includes(item) === false) arr.push(name);
              });
              return arr;
            }, []);
          MATERIAL_EVENT[eventName].forEach(item => {
            if (onlineEventList.includes(item) === false) deleteList.push(item);
          });
        } else deleteList.push(eventName);

        deleteList.forEach(item => {
          const eventHandler = this.domHandleEventManager.get(eventName, useCapture);
          this.target.removeEventListener(item, eventHandler, useCapture);
          this.domHandleEventManager.delete(eventName, useCapture);
        });
      }
    }
  }
}
