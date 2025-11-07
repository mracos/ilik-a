/**
 * Date utility functions for formatting and manipulation
 */

export const DateUtils = {
  /**
   * Format a date to ISO string (YYYY-MM-DD)
   * @param {Date} date - The date to format
   * @returns {string} ISO formatted date string
   */
  toISODateString(date) {
    return date.toISOString().split('T')[0];
  },

  /**
   * Format a date to human readable format
   * @param {Date} date - The date to format
   * @returns {string} Formatted date string (e.g., "Monday, January 1, 2024")
   */
  formatLong(date) {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  },

  /**
   * Get today's date as ISO string
   * @returns {string} Today's date in ISO format
   */
  getTodayISO() {
    return this.toISODateString(new Date());
  },

  /**
   * Apply time offset to a date
   * @param {Date} baseDate - The starting date
   * @param {number} offset - Amount to add/subtract
   * @param {string} unit - Time unit (hours, days, weeks, months, years)
   * @returns {Date} New date with offset applied
   */
  applyOffset(baseDate, offset, unit) {
    const resultDate = new Date(baseDate);

    switch (unit) {
      case 'hours':
        resultDate.setHours(baseDate.getHours() + offset);
        break;
      case 'days':
        resultDate.setDate(baseDate.getDate() + offset);
        break;
      case 'weeks':
        resultDate.setDate(baseDate.getDate() + (offset * 7));
        break;
      case 'months':
        resultDate.setMonth(baseDate.getMonth() + offset);
        break;
      case 'years':
        resultDate.setFullYear(baseDate.getFullYear() + offset);
        break;
    }

    return resultDate;
  },

  /**
   * Get singular form of time unit
   * @param {string} unit - The time unit (plural)
   * @returns {string} Singular form of unit
   */
  singularizeUnit(unit) {
    return unit.slice(0, -1);
  }
};
