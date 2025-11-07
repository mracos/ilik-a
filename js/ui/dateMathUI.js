/**
 * Date math calculator UI rendering
 */

import { DOMUtils } from '../utils/domUtils.js';
import { DateUtils } from '../utils/dateUtils.js';
import { DateMathCalculator } from '../calculators/dateMathCalculator.js';

export const DateMathUI = {
  /**
   * Render date calculation result
   * @param {string} baseDateInput - Base date input value
   * @param {string} offsetInput - Offset input value
   * @param {string} unit - Time unit
   */
  render(baseDateInput, offsetInput, unit) {
    const resultId = 'dateResult';

    // Validate inputs
    if (!baseDateInput || !offsetInput) {
      DOMUtils.showError(resultId, 'ENTER BASE DATE AND OFFSET');
      return;
    }

    const baseDate = new Date(baseDateInput);
    const offset = parseInt(offsetInput);

    // Calculate result
    const result = DateMathCalculator.calculate(baseDate, offset, unit);

    // Build result HTML
    let html = `${result.offset} ${result.unit.toUpperCase()} ${result.direction} ${DateUtils.formatLong(result.baseDate)}:<br>`;
    html += `${DateUtils.formatLong(result.resultDate)}<br>`;
    html += DateUtils.toISODateString(result.resultDate);

    if (result.includeTime) {
      const timeString = result.resultDate.toTimeString().split(' ')[0];
      html += ` ${timeString}`;
    }

    DOMUtils.showResult(resultId, html, true);
  },

  /**
   * Render quick date calculation result
   * @param {Date} baseDate - Base date
   * @param {number} offset - Offset amount
   * @param {string} unit - Time unit
   */
  renderQuick(baseDate, offset, unit) {
    const resultDate = DateUtils.applyOffset(baseDate, offset, unit);
    const description = DateMathCalculator.getQuickDescription(offset, unit);

    const html = `
      ${description}:<br>
      ${DateUtils.formatLong(resultDate)}<br>
      ${DateUtils.toISODateString(resultDate)}
    `;

    DOMUtils.showResult('dateResult', html, true);
  }
};
