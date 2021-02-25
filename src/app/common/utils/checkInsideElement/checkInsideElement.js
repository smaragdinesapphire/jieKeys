import { check } from 'prettier';

/**
 * @function checkInsideElement
 * @param {object} event event object
 * @param {object} element element object
 * @returns {boolean} is in the element?
 */
const checkInsideElement = (event, element) => {
  const rect = element.getBoundingClientRect();
  const { clientX, clientY } = event.changedTouches ? event.changedTouches[0] : event;
  return rect.left <= clientX && clientX <= rect.right && rect.top <= clientY && clientY <= rect.bottom;
};

export default checkInsideElement;
