import React, { useState } from 'react';

const options = [
  { label: '按起來', value: 'Click' },
  { label: '跳起來', value: 'Jump' },
  { label: '飛起來', value: 'Fly' },
];

const Topics = () => {
  const [clickOption, setClickOption] = useState(['Click']);

  return (
    <div className="topic">
      <div className="topic__title">{`Topic Page (${JSON.stringify(clickOption)})`}</div>
      <div className="topic__block">
        {options.map(option => (
          <div key={option.value}>
            <input
              name="isGoing"
              type="checkbox"
              checked={clickOption === option.value}
              onChange={() => setClickOption(option.value)}
            />
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Topics;
