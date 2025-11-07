/**
 * Date math calculation logic
 */

import { DateUtils } from '../utils/dateUtils.js';

export const DateMathCalculator = {
  /**
   * Calculate new date by applying offset
   * @param {Date} baseDate - Starting date
   * @param {number} offset - Amount to add/subtract
   * @param {string} unit - Time unit (hours, days, weeks, months, years)
   * @returns {Object} Result with base date, result date, and formatted info
   */
  calculate(baseDate, offset, unit) {
    const resultDate = DateUtils.applyOffset(baseDate, offset, unit);

    const unitWord = Math.abs(offset) === 1
      ? DateUtils.singularizeUnit(unit)
      : unit;
    const direction = offset >= 0 ? 'AFTER' : 'BEFORE';
    const absOffset = Math.abs(offset);

    return {
      baseDate,
      resultDate,
      offset: absOffset,
      unit: unitWord,
      direction,
      includeTime: unit === 'hours'
    };
  },

  /**
   * Get quick calculation description
   * @param {number} offset - Offset amount
   * @param {string} unit - Time unit
   * @returns {string|null} Description or null if not a quick calculation
   */
  getQuickDescription(offset, unit) {
    const descriptions = {
      'days,1': 'TOMORROW',
      'days,-1': 'YESTERDAY',
      'days,7': 'NEXT WEEK',
      'days,-7': 'LAST WEEK',
      'months,1': 'NEXT MONTH',
      'months,-1': 'LAST MONTH'
    };

    return descriptions[`${unit},${offset}`] || null;
  }
};
