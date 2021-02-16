/**
 * @function getPosition
 * @param {object} event event object
 * @param {string} touchEventName touch event name
 * @returns {object} position
 */
export const getPosition = event => {
  const [{ clientX, clientY }] = event.touches;
  return {
    clientX,
    clientY,
  };
};

/**
 * @function checkInsideElement
 * @param {object} event event object
 * @param {object} element element object
 * @returns {boolean} is in the element?
 */
export const checkInsideElement = (event, element) => {
  const rect = element.getBoundingClientRect();
  const { clientX, clientY } = event.changedTouches[0];
  return rect.left <= clientX && clientX <= rect.right && rect.top <= clientY && clientY <= rect.bottom;
};
