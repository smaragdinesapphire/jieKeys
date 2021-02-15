import Publisher from '../../../utils/Publisher';

const EVENT_KEY = {
  MOUSE_DOWN: 'mousedown',
  MOUSE_UP: 'mouseup',
  MOUSE_MOVE: 'mousemove',
  MOUSE_ENTER: 'mouseenter',
  MOUSE_LEAVE: 'mouseleave',
  CLICK: 'click',
  CONTEXT_MENU: 'contextmenu',
};

const HANDLE_WINDOW_LIST = [EVENT_KEY.MOUSE_UP, EVENT_KEY.MOUSE_MOVE];

const EVENT_MAP = {
  [EVENT_KEY.MOUSE_UP]: 'handleMouseUp',
  [EVENT_KEY.MOUSE_DOWN]: 'handleMouseDown',
  [EVENT_KEY.MOUSE_MOVE]: 'handleMouseMove',
  [EVENT_KEY.MOUSE_ENTER]: 'handleMouseEnter',
  [EVENT_KEY.MOUSE_LEAVE]: 'handleMouseLeave',
  [EVENT_KEY.CLICK]: 'handleClick',
  [EVENT_KEY.CONTEXT_MENU]: 'handleContextMenu',
};

class PCEventHandler {
  constructor(props) {
    const { button, noHandleEventList = [] } = props;
    this.button = button;
    this.noHandleEventList = noHandleEventList;
    this.handlingList = [];

    this.onMouseDown = new Publisher();
    this.onMouseUp = new Publisher();
    this.onMouseMove = new Publisher();
    this.onMouseEnter = new Publisher();
    this.onMouseLeave = new Publisher();
    this.onClick = new Publisher();
    this.onContextMenu = new Publisher();

    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
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

  handleClick(e) {
    this.onClick.publish(e);
  }

  handleMouseUp(e) {
    this.unhandleEvent([EVENT_KEY.MOUSE_MOVE, EVENT_KEY.MOUSE_UP]);
    this.handleEvent(EVENT_KEY.MOUSE_DOWN);
    this.onMouseUp.publish(e);
  }

  handleMouseMove(e) {
    this.onMouseMove.publish(e);
  }

  handleMouseEnter(e) {
    this.unhandleEvent(EVENT_KEY.MOUSE_ENTER);
    this.handleEvent(EVENT_KEY.MOUSE_LEAVE);
    this.onMouseEnter.publish(e);
  }

  handleMouseLeave(e) {
    this.unhandleEvent(EVENT_KEY.MOUSE_LEAVE);
    this.handleEvent(EVENT_KEY.MOUSE_ENTER);
    this.onMouseLeave.publish(e);
  }

  handleContextMenu(e) {
    this.onContextMenu.publish(e);
  }

  handleMouseDown(e) {
    this.unhandleEvent(EVENT_KEY.MOUSE_DOWN);
    this.handleEvent([EVENT_KEY.MOUSE_UP, EVENT_KEY.MOUSE_MOVE]);
    this.onMouseDown.publish(e);
  }

  start() {
    this.handleEvent([EVENT_KEY.MOUSE_ENTER, EVENT_KEY.MOUSE_DOWN, EVENT_KEY.CONTEXT_MENU, EVENT_KEY.CLICK]);
  }

  end() {
    this.unhandleEventAll();
  }
}

PCEventHandler.EVENT_KEY = EVENT_KEY;
export default PCEventHandler;
