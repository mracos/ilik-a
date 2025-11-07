/**
 * Age calculator UI rendering
 */

import { DOMUtils } from '../utils/domUtils.js';
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

    // Parse dates
    const birthDate = new Date(birthDateInput);
    const targetDate = new Date(targetDateInput);

    // Calculate age
    try {
      const age = AgeCalculator.calculate(birthDate, targetDate);
      const ageText = AgeCalculator.formatShort(age);

      const html = `
        <div class="age-main">AGE: ${ageText}</div>
        <div class="age-breakdown-compact">
          ${age.totalDays.toLocaleString()} days • ${age.totalWeeks.toLocaleString()} weeks • ${age.totalMonths} months • ${age.totalYears} years
        </div>
      `;

      DOMUtils.showResult(resultId, html, true);
    } catch (error) {
      DOMUtils.showError(resultId, error.message);
    }
  }
};
