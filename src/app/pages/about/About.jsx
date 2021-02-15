import React from 'react';

const About = () => (
  <div className="about">
    <div className="about__title">About Page</div>
    <div className="about__avatar">
      <div className="about__avatar-item" icon="user" />
      <div className="about__avatar-item">U</div>
      <div className="about__avatar-item">USER</div>
      <div className="about__avatar-item" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      <div className="about__avatar-item" style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
        U
      </div>
      <div className="about__avatar-item" style={{ backgroundColor: '#87d068' }} icon="user" />
    </div>
  </div>
);

export default About;
