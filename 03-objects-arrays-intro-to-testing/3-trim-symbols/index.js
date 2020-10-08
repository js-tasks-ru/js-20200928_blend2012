/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === 0) return '';
  if (!size) return string;
  return [...string].reduce((accumulator, currentValue) => {
    const lastAddedLetter = accumulator[accumulator.length - 1];
    if (lastAddedLetter && lastAddedLetter === currentValue) {
      let counter = 0;
      for (let i = accumulator.length - 1; i >= 0; i--) {
        if (accumulator[i] === currentValue) {
          counter += 1;
        } else {
          break;
        }
      }
      if (counter <= size - 1) {
        return [...accumulator, currentValue];
      } else {
        return accumulator;
      }
    } else {
      return [...accumulator, currentValue];
    }
  }, []).join('');
}
