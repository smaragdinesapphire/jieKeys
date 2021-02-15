import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './button.scss';

const Button = props => {
  const { className, children, onAction } = props;
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    const arr = ['mousedown', 'mouseup', 'touchstart', 'touchend', 'touchend', 'touchmove', 'contextmenu', 'click'];
    arr.forEach(action => button.addEventListener(action, () => onAction && onAction(action)));
  }, []);

  return (
    <div ref={buttonRef} className={classnames('jieKeys-button', className)}>
      {children}
    </div>
  );
};
Button.defaultProps = {
  className: null,
  children: null,
  onAction: null,
};
Button.propTypes = {
  className: PropTypes.oneOf([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  children: PropTypes.node,
  onAction: PropTypes.func,
};

export default Button;
