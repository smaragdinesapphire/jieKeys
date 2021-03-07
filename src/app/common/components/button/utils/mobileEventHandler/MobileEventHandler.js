import Publisher from '../../../../utils/Publisher';
import { checkInsideElement, getPosition } from './utils/utils';

const EVENT_KEY = {
  MOUSE_DOWN: 'touchstart',
  MOUSE_UP: 'touchend',
  MOUSE_MOVE: 'touchmove',
  CONTEXT_MENU: 'contextmenu',
};

const EVENT_MAP = {
  [EVENT_KEY.MOUSE_DOWN]: 'handleMouseDown',
  [EVENT_KEY.MOUSE_UP]: 'handleMouseUp',
  [EVENT_KEY.MOUSE_MOVE]: 'handleMouseMove',
  [EVENT_KEY.CONTEXT_MENU]: 'handleContextMenu',
};

const CONTEXT_MENU_STATE = {
  WAITING: 'WAITING',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
};

const HANDLE_WINDOW_LIST = [];

const CONTEXT_MENU_MOVE_LIMIT_PIXEL = 3 ** 2;
const CONTEXT_MENU_TIME = 1000;

class MobileEventHandler {
  constructor(props) {
    const {
      button,
      noHandleEventList = [],
      moveLimitPixel = CONTEXT_MENU_MOVE_LIMIT_PIXEL,
      contextMenuTriggerTime = CONTEXT_MENU_TIME,
    } = props;
    this.button = button;
    this.noHandleEventList = noHandleEventList;
    this.handlingList = [];
    this.moveLimitPixel = moveLimitPixel;
    this.contextMenuTriggerTime = contextMenuTriggerTime;

    // record
    this.mouseDownStartPosition = { clientX: -99999, clientY: -99999 };
    this.contextMenuPrepareTimer = null;
    this.contextMenuPrepareState = CONTEXT_MENU_STATE.WAITING;

    this.onMouseDown = new Publisher();
    this.onMouseUp = new Publisher();
    this.onMouseMove = new Publisher();
    this.onClick = new Publisher();
    this.onContextMenu = new Publisher();

    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
  }

  clearContextMenuPrepareTimer() {
    window.clearTimeout(this.contextMenuPrepareTimer);
    this.contextMenuPrepareTimer = null;
  }

  showContextMenu() {
    this.contextMenuPrepareState = CONTEXT_MENU_STATE.SUCCESS;
    this.clearContextMenuPrepareTimer();
    this.onContextMenu.publish();
  }

  checkMoveRange(e) {
    if (this.contextMenuPrepareTimer !== null) {
      const { clientX, clientY } = getPosition(e);
      const moveX = clientX - this.mouseDownStartPosition.clientX;
      const moveY = clientY - this.mouseDownStartPosition.clientY;
      if (Math.abs(moveY) ** 2 + Math.abs(moveX) ** 2 > this.moveLimitPixel) {
        this.contextMenuPrepareState = CONTEXT_MENU_STATE.FAIL;
        this.clearContextMenuPrepareTimer();
      }
    }
  }

  prepareContextMenu() {
    this.contextMenuPrepareState = CONTEXT_MENU_STATE.WAITING;
    this.contextMenuPrepareTimer = window.setTimeout(() => this.showContextMenu(), this.contextMenuTriggerTime);
  }

  updateMouseDownPosition(e) {
    this.mouseDownStartPosition = getPosition(e);
  }

  unhandleEvent(userList) {
    const list = Array.isArray(userList) ? userList : [userList];
    list.forEach(action => {
      if (HANDLE_WINDOW_LIST.includes(action)) window.removeEventListener(action, this[EVENT_MAP[action]]);
      else this.button.removeEventListener(action, this[EVENT_MAP[action]]);
    });

    this.handlingList = this.handlingList.filter(action => list.includes(action) === false);
  }

  unhandleEventAll() {
    this.handlingList.forEach(action => this.button.removeEventListener(action, this[EVENT_MAP[action]]));
    this.handlingList.length = 0;
  }

  handleEvent(userList) {
    const list = Array.isArray(userList) ? userList : [userList];
    list.forEach(action => {
      if (this.noHandleEventList.includes(action) === false) {
        if (HANDLE_WINDOW_LIST.includes(action)) window.addEventListener(action, this[EVENT_MAP[action]]);
        else this.button.addEventListener(action, this[EVENT_MAP[action]]);
        this.handlingList.push(action);
      }
    });
  }

  handleMouseUp(e) {
    this.clearContextMenuPrepareTimer();
    this.unhandleEvent([EVENT_KEY.MOUSE_UP, EVENT_KEY.MOUSE_MOVE]);
    this.handleEvent(EVENT_KEY.MOUSE_DOWN);
    this.onMouseUp.publish(e);
    if (this.contextMenuPrepareState !== CONTEXT_MENU_STATE.SUCCESS && checkInsideElement(e, this.button))
      this.onClick.publish();
  }

  handleMouseMove(e) {
    this.checkMoveRange(e);
    this.onMouseMove.publish(e);
  }

  // eslint-disable-next-line class-methods-use-this
  handleContextMenu(e) {
    e.stopPropagation(); // 擋掉原生行為，避免 IOS 與 Android 不一致
  }

  handleMouseDown(e) {
    this.unhandleEvent(EVENT_KEY.MOUSE_DOWN);
    this.handleEvent([EVENT_KEY.MOUSE_UP, EVENT_KEY.MOUSE_MOVE]);
    this.prepareContextMenu();
    this.updateMouseDownPosition(e);
    this.onMouseDown.publish(e);
  }

  start() {
    this.handleEvent([EVENT_KEY.MOUSE_ENTER, EVENT_KEY.MOUSE_DOWN, EVENT_KEY.CONTEXT_MENU, EVENT_KEY.CLICK]);
  }

  end() {
    this.unhandleEventAll();
  }
}

MobileEventHandler.EVENT_KEY = EVENT_KEY;
export default MobileEventHandler;
