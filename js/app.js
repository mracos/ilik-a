/**
 * Main application entry point
 */

import { DateUtils } from './utils/dateUtils.js';
import { DOMUtils } from './utils/domUtils.js';
import { URLUtils } from './utils/urlUtils.js';
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
    URLUtils.updateURL({ tab: 'dateMath', base: baseDate, offset, unit: AppState.currentUnit });
    showShareButton('dateMathTab');
  },

  /**
   * Handle age calculation
   */
  calculateAge() {
    const birthDate = DOMUtils.getInputValue('birthDate');
    const targetDate = DOMUtils.getInputValue('baseDate');
    AgeUI.render(birthDate, targetDate);
    URLUtils.updateURL({ tab: 'age', base: targetDate, birth: birthDate });
    showShareButton('ageTab');
  },

  /**
   * Handle tab switching
   */
  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });

    const targetTab = tabName === 'dateMath' ? 'dateMathTab' : 'ageTab';
    DOMUtils.getById(targetTab).classList.add('active');

    // Clear URL params when switching tabs
    history.replaceState(null, '', window.location.pathname);
  },

  /**
   * Handle quick date button click
   */
  quickDate(offset, unit) {
    const baseDateValue = DOMUtils.getInputValue('baseDate') || DateUtils.getTodayISO();
    const baseDate = new Date(baseDateValue);
    DateMathUI.renderQuick(baseDate, offset, unit);
    URLUtils.updateURL({ tab: 'dateMath', base: baseDateValue, offset: String(offset), unit, quick: true });
    showShareButton('dateMathTab');
  },

  /**
   * Copy shareable link to clipboard
   */
  async shareLink(btn) {
    const success = await URLUtils.copyLink();
    const original = btn.textContent;
    btn.textContent = success ? 'COPIED!' : 'FAILED';
    setTimeout(() => { btn.textContent = original; }, 1500);
  }
};

/**
 * Show the share button inside a tab
 */
function showShareButton(tabId) {
  const btn = DOMUtils.getById(tabId).querySelector('.share-button');
  if (btn) btn.style.display = '';
}

/**
 * Restore state from URL params and auto-calculate
 */
function restoreFromURL() {
  const state = URLUtils.readState();
  if (!state) return false;

  if (state.base) {
    DOMUtils.setInputValue('baseDate', state.base);
  }

  EventHandlers.switchTab(state.tab);

  if (state.tab === 'dateMath' && state.offset && state.unit) {
    if (state.quick) {
      const baseDateValue = state.base || DateUtils.getTodayISO();
      const baseDate = new Date(baseDateValue);
      DateMathUI.renderQuick(baseDate, parseInt(state.offset), state.unit);
    } else {
      DOMUtils.setInputValue('timeOffset', state.offset);
      EventHandlers.selectUnit(state.unit, state.unit.charAt(0).toUpperCase() + state.unit.slice(1));
      DateMathUI.render(state.base, state.offset, state.unit);
    }
    showShareButton('dateMathTab');
  } else if (state.tab === 'age' && state.birth) {
    DOMUtils.setInputValue('birthDate', state.birth);
    AgeUI.render(state.birth, state.base);
    showShareButton('ageTab');
  }

  return true;
}

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
  window.switchTab = EventHandlers.switchTab;
  window.shareLink = EventHandlers.shareLink;

  // Restore from URL if shared link, otherwise use defaults
  restoreFromURL();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
