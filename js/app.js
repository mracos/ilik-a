/**
 * Main application entry point
 */

import { DateUtils } from './utils/dateUtils.js';
import { DOMUtils } from './utils/domUtils.js';
import { AgeUI } from './ui/ageUI.js';
import { DateMathUI } from './ui/dateMathUI.js';

// Application state
const AppState = {
  currentUnit: 'days'
};

/**
 * Event handlers
 */
const EventHandlers = {
  /**
   * Handle "Set Today" button click
   */
  setToday(inputId) {
    DOMUtils.setInputValue(inputId, DateUtils.getTodayISO());
  },

  /**
   * Handle unit dropdown toggle
   */
  toggleUnitDropdown() {
    const dropdown = DOMUtils.getById('unitDropdown');
    dropdown.classList.toggle('show');
  },

  /**
   * Handle unit selection
   */
  selectUnit(unit, displayName) {
    AppState.currentUnit = unit;
    DOMUtils.setHTML('unitButton', displayName);
    DOMUtils.getById('unitDropdown').classList.remove('show');
  },

  /**
   * Handle date calculation
   */
  calculateDate() {
    const baseDate = DOMUtils.getInputValue('baseDate');
    const offset = DOMUtils.getInputValue('timeOffset');
    DateMathUI.render(baseDate, offset, AppState.currentUnit);
  },

  /**
   * Handle age calculation
   */
  calculateAge() {
    const birthDate = DOMUtils.getInputValue('birthDate');
    const targetDate = DOMUtils.getInputValue('baseDate');
    AgeUI.render(birthDate, targetDate);
  },

  /**
   * Handle quick date button click
   */
  quickDate(offset, unit) {
    const baseDateValue = DOMUtils.getInputValue('baseDate') || DateUtils.getTodayISO();
    const baseDate = new Date(baseDateValue);
    DateMathUI.renderQuick(baseDate, offset, unit);
  }
};

/**
 * Initialize application
 */
function init() {
  // Set base date to today
  DOMUtils.setInputValue('baseDate', DateUtils.getTodayISO());

  // Setup dropdown click outside handler
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.unit-selector')) {
      DOMUtils.getById('unitDropdown').classList.remove('show');
    }
  });

  // Setup Enter key handlers
  DOMUtils.getById('timeOffset').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      EventHandlers.calculateDate();
    }
  });

  DOMUtils.getById('birthDate').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      EventHandlers.calculateAge();
    }
  });

  // Expose event handlers to global scope for onclick attributes
  window.setToday = EventHandlers.setToday;
  window.toggleUnitDropdown = EventHandlers.toggleUnitDropdown;
  window.selectUnit = EventHandlers.selectUnit;
  window.calculateDate = EventHandlers.calculateDate;
  window.calculateAge = EventHandlers.calculateAge;
  window.quickDate = EventHandlers.quickDate;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
