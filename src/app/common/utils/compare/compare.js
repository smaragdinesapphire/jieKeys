/**
 * @function compare
 * @param {*} a target a
 * @param {*} b target b
 * @param {*} isDeep 是否為深度比較
 * @returns {boolean} true: 相同, false: 不同
 */
const compare = (a, b, isDeep = false) => {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  switch (typeof a) {
    // case 'string':
    // case 'undefined':
    // case 'boolean':
    case 'function':
      if (isDeep) {
        if (
          (a instanceof Date && b instanceof Date) ||
          (a instanceof RegExp && b instanceof RegExp) ||
          (a instanceof String && b instanceof String) ||
          (a instanceof Number && b instanceof Number)
        ) {
          return a.toString() === b.toString();
        }
      } else if (a === b) return true;
      break;
    case 'number':
      if (Number.isNaN(a) && Number.isNaN(b)) return true;
      break;
    case 'object':
      if ((Array.isArray(a) && !Array.isArray(b)) || (Array.isArray(b) && !Array.isArray(a))) return false;

      // Array
      if (Array.isArray(a) && Array.isArray(b)) {
        if (isDeep) return a.some((value, index) => compare(value, b[index], true) === false) === false;
        return a.some((value, index) => value !== b[index]) === false;
      }
      // Object
      if (isDeep) return Object.keys(a).some(key => compare(a[key], b[key], true) === false) === false;
      return Object.keys(a).some(key => a[key] !== b[key]) === false;
    default:
    // no default
  }
  return false;
};
export default compare;
