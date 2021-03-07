/**
 * 從 Event Object 解析座標
 *
 * @function getEventPosition
 * @param {object} e event object
 * @returns {object} position
 */
const getEventPosition = e => {
  let clientX;
  let clientY;

  if (/touch/.test(e.type)) [{ clientX, clientY }] = e.touches;
  else ({ clientX, clientY } = e);

  return {
    clientX,
    clientY,
  };
};
export default getEventPosition;
