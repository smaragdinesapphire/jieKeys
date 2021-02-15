import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { countUp, countDown } from './homeAction';

const Home = () => {
  const dispatch = useDispatch();
  const { count } = useSelector(state => state.home);

  const [active, setActive] = useState(false);

  return (
    <div className="home">
      <div
        className={classNames('home__title', {
          'home__title--active': active,
        })}
      >
        Home Page
      </div>
      <FormattedMessage id="superHello" values={{ someoneName: 'Hsun.Tsai' }} />
      <button className="home__btn" type="button" onClick={() => setActive(!active)}>
        {`Home Title ${active ? 'inActive' : 'Active'}`}
      </button>

      <br />
      <div>{`Now Count ==> ${count}`}</div>
      <div>
        <button type="button" onClick={() => countUp(dispatch, count)}>
          Count Up
        </button>
        <button type="button" onClick={() => countDown(dispatch, count)}>
          Count Down
        </button>
      </div>
    </div>
  );
};

export default Home;
