/**
 * Age calculation logic
 */

import { DateUtils } from '../utils/dateUtils.js';

export const AgeCalculator = {
  /**
   * Calculate age between two dates
   * @param {Date} birthDate - Birth date
   * @param {Date} targetDate - Target date to calculate age to
   * @returns {Object} Age breakdown with various metrics
   */
  calculate(birthDate, targetDate) {
    // Validate dates
    if (targetDate < birthDate) {
      throw new Error('TARGET DATE CANNOT BE BEFORE BIRTH DATE');
    }

    const birth = DateUtils.getDateParts(birthDate);
    const target = DateUtils.getDateParts(targetDate);

    // Calculate years, months, days
    let years = target.year - birth.year;
    let months = target.month - birth.month;
    let days = target.day - birth.day;

    if (days < 0) {
      months--;
      const lastMonth = new Date(target.year, target.month - 1, 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate totals
    const timeDiff = targetDate.getTime() - birthDate.getTime();
    const totalDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalYears = (totalDays / 365.25).toFixed(2);

    // Calculate days until next birthday
    const nextBirthday = new Date(target.year, birth.month - 1, birth.day, 12);
    if (nextBirthday <= targetDate) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - targetDate.getTime()) / (1000 * 3600 * 24));

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      totalYears,
      daysUntilBirthday,
      nextBirthday
    };
  },

  /**
   * Format age as short string (e.g., "25Y 3M 15D")
   * @param {Object} age - Age object from calculate()
   * @returns {string} Formatted age string
   */
  formatShort(age) {
    const { years, months, days } = age;

    if (years > 0) {
      return `${years}Y ${months}M ${days}D`;
    } else if (months > 0) {
      return `${months}M ${days}D`;
    } else {
      return `${days}D`;
    }
  }
};
