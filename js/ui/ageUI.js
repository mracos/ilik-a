/**
 * Age calculator UI rendering
 */

import { DOMUtils } from '../utils/domUtils.js';
import { DateUtils } from '../utils/dateUtils.js';
import { AgeCalculator } from '../calculators/ageCalculator.js';

export const AgeUI = {
  /**
   * Render age calculation result
   * @param {string} birthDateInput - Birth date input value
   * @param {string} targetDateInput - Target date input value
   */
  render(birthDateInput, targetDateInput) {
    const resultId = 'ageResult';

    // Validate inputs
    if (!birthDateInput) {
      DOMUtils.showError(resultId, 'ENTER BIRTH DATE');
      return;
    }

    if (!targetDateInput) {
      DOMUtils.showError(resultId, 'ENTER TARGET DATE ABOVE');
      return;
    }

    // Parse dates (noon to avoid UTC midnight boundary issues)
    const birthDate = DateUtils.parseInput(birthDateInput);
    const targetDate = DateUtils.parseInput(targetDateInput);

    // Calculate age
    try {
      const age = AgeCalculator.calculate(birthDate, targetDate);
      const ageText = AgeCalculator.formatShort(age);

      const nextBirthdayFormatted = DateUtils.formatLong(age.nextBirthday);

      const html = `
        <div class="age-main">AGE: ${ageText}</div>
        <div class="age-breakdown-compact">
          ${age.totalDays.toLocaleString()} days • ${age.totalWeeks.toLocaleString()} weeks • ${age.totalMonths} months • ${age.totalYears} years
        </div>
        <div class="birthday-countdown">
          🎂 ${age.daysUntilBirthday} days until next birthday (${nextBirthdayFormatted})
        </div>
      `;

      DOMUtils.showResult(resultId, html, true);
    } catch (error) {
      DOMUtils.showError(resultId, error.message);
    }
  }
};
