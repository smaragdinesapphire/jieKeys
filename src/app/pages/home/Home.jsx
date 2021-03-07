/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import Button from '../../common/components/button/Button';
import './home.scss';

const MAX_LINE = 20;

const Home = () => {
  const [actionList, setActionList] = useState([]);
  const indexRef = useRef(1);
  const buttonRef = useRef(null);

  // useEffect(() => {
  //   const button = buttonRef.current;
  //   [
  //     'touchstart',
  //     'touchend',
  //     'touchmove',
  //     'mousedown',
  //     'mousemove',
  //     'mouseup',
  //     'click',
  //     'contextmenu',
  //     'mouseleave',
  //     'mouseenter',
  //   ].forEach(action => {
  //     if (action !== 'touchmove') {
  //       button.addEventListener(action, e => {
  //         if (/touch/.test(action)) e.preventDefault();
  //         e.stopPropagation();
  //         setActionList(prev => {
  //           const newList = [`${indexRef.current}. ${action}`, ...prev];
  //           indexRef.current += 1;
  //           if (newList.length > MAX_LINE) newList.length = MAX_LINE;
  //           return newList;
  //         });
  //       });
  //     } else {
  //       window.addEventListener(action, e => {
  //         setActionList(prev => {
  //           const newList = [`${indexRef.current}. ${action}`, ...prev];
  //           indexRef.current += 1;
  //           if (newList.length > MAX_LINE) newList.length = MAX_LINE;
  //           return newList;
  //         });
  //       });
  //     }
  //   });
  // }, []);

  const handleEvent = action => {
    setActionList(prev => {
      const newList = [`${indexRef.current}. ${action}`, ...prev];
      indexRef.current += 1;
      if (newList.length > MAX_LINE) newList.length = MAX_LINE;
      return newList;
    });
  };

  return (
    <div className="home">
      <Button
        onClick={() => handleEvent('click')}
        onMouseEnter={() => handleEvent('onMouseEnter')}
        onContextMenu={() => handleEvent('contextmenu')}
        onMouseDown={() => handleEvent('mousedown')}
        onMouseUp={() => handleEvent('mouseup')}
        onMouseLeave={() => handleEvent('mouseleave')}
        onMouseMove={() => handleEvent('mousemove')}
      >
        Click
      </Button>
      <Button disable>Click</Button>
      <Button>Click</Button>
      <Button>Click</Button>
      <Button action>Click</Button>
      <Button>Click</Button>
      <Button>Click</Button>
      <div className="demo">
        {actionList.map((action, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index}>{action}</div>
        ))}
      </div>
    </div>
  );
};

export default Home;
