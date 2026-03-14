/**
 * Date utility functions for formatting and manipulation
 */

export const DateUtils = {
  /** Current timezone (IANA name). Defaults to browser timezone. */
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

  /**
   * Format a date to ISO string (YYYY-MM-DD) in the current timezone
   * @param {Date} date - The date to format
   * @returns {string} ISO formatted date string
   */
  toISODateString(date) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: this.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(date);
    const get = type => parts.find(p => p.type === type).value;
    return `${get('year')}-${get('month')}-${get('day')}`;
  },

  /**
   * Format a date to human readable format
   * @param {Date} date - The date to format
   * @returns {string} Formatted date string (e.g., "Monday, January 1, 2024")
   */
  formatLong(date) {
    const options = {
      timeZone: this.timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  },

  /**
   * Get today's date as ISO string in the current timezone
   * @returns {string} Today's date in ISO format
   */
  getTodayISO() {
    return this.toISODateString(new Date());
  },

  /**
   * Parse a YYYY-MM-DD input string into a Date at noon (avoids UTC midnight boundary issues)
   * @param {string} dateStr - Date string from input (YYYY-MM-DD)
   * @returns {Date} Parsed date
   */
  parseInput(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d, 12, 0, 0);
  },

  /**
   * Get year/month/day components of a date in the current timezone
   * @param {Date} date
   * @returns {{ year: number, month: number, day: number }}
   */
  getDateParts(date) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: this.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(date);
    const get = type => Number(parts.find(p => p.type === type).value);
    return { year: get('year'), month: get('month'), day: get('day') };
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
