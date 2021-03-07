import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import TouchEventConverter from '../../utils/touchEventConverter/TouchEventConverter';
import compare from '../../utils/compare/compare';
import './button.scss';

const Button = props => {
  const { action, className, children, disable, ...eventHandler } = props;
  const [isHolding, setIsHolding] = useState(false);
  const buttonRef = useRef(null);
  const fakeWindowRef = useRef(null);
  const fakeButtonRef = useRef(null);
  const preEventHandlerRef = useRef({});

  const prefixClass = 'jieKeys-button';
  const buttonClass = classnames(
    prefixClass,
    {
      [`${prefixClass}--disable`]: disable,
      [`${prefixClass}--action`]: disable !== true && action,
      [`${prefixClass}--holding`]: disable !== true && isHolding,
    },
    className
  );

  useEffect(() => {
    fakeWindowRef.current = new TouchEventConverter(window);
    fakeButtonRef.current = new TouchEventConverter(buttonRef.current, true);
  }, []);

  useEffect(() => {
    const fakeWindow = fakeWindowRef.current;
    const button = fakeButtonRef.current;
    const eventHandlerMap = new Map();
    const handleMouseDown = e => {
      setIsHolding(true);
      if (eventHandler && eventHandler.onMouseDown) eventHandler.onMouseDown(e);
    };
    const handleMouseUp = () => setIsHolding(false);
    Object.keys(eventHandler || {})
      .filter(handleName => !!eventHandler[handleName])
      .forEach(handleName => {
        const eventName = handleName.slice(2).toLowerCase();
        switch (eventName) {
          case 'mousedown':
            break;
          default:
            eventHandlerMap.set(eventName, eventHandler[handleName]);
            button.addEventListener(eventName, eventHandler[handleName]);
        }
      });
    button.addEventListener('mousedown', handleMouseDown);
    fakeWindow.addEventListener('mouseup', handleMouseUp);
    eventHandlerMap.set('mousedown', handleMouseDown);
    eventHandlerMap.set('windowMouseup', handleMouseUp);

    return () => {
      eventHandlerMap.forEach((handler, eventName) => {
        switch (eventName) {
          case 'windowMouseup':
            fakeWindow.removeEventListener('mouseup', handler);
            break;
          default:
            button.removeEventListener(eventName, handler);
        }
      });
    };
  }, [compare(eventHandler, preEventHandlerRef.current)]);

  return (
    <div ref={buttonRef} className={buttonClass}>
      {children}
    </div>
  );
};
Button.defaultProps = {
  action: false,
  className: null,
  children: null,
  disable: false,
  onClick: null,
  onContextMenu: null,
  onMouseDown: null,
  onMouseEnter: null,
  onMouseLeave: null,
  onMouseMove: null,
  onMouseUp: null,
};
Button.propTypes = {
  action: PropTypes.bool,
  className: PropTypes.oneOf([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  children: PropTypes.node,
  disable: PropTypes.bool,
  onClick: PropTypes.func,
  onContextMenu: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseUp: PropTypes.func,
};

export default Button;
