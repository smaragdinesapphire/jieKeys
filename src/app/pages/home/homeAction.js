import { add, sub } from './utils/counter';

export const COUNT_CHANGE = 'COUNT_CHANGE';

export const countUp = (dispatch, count) => {
  if (count < 5) {
    dispatch({
      type: COUNT_CHANGE,
      payload: { count: add(count) },
    });
  } else {
    alert(['error', 'Stop', 'Count can not bigger than 5'].join('\n'));
  }
};

export const countDown = (dispatch, count) => {
  if (count > 0) {
    dispatch({
      type: COUNT_CHANGE,
      payload: { count: sub(count) },
    });
  } else {
    alert(['error', 'Stop', 'Count can not smaller than 0'].join('\n'));
  }
};
