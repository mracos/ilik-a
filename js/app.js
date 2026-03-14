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
    URLUtils.updateURL({ tab: 'dateMath', base: baseDate, offset, unit: AppState.currentUnit, tz: DateUtils.timezone });
    showShareButton('dateMathTab');
  },

  /**
   * Handle age calculation
   */
  calculateAge() {
    const birthDate = DOMUtils.getInputValue('birthDate');
    const targetDate = DOMUtils.getInputValue('baseDate');
    AgeUI.render(birthDate, targetDate);
    URLUtils.updateURL({ tab: 'age', base: targetDate, birth: birthDate, tz: DateUtils.timezone });
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
    const baseDate = DateUtils.parseInput(baseDateValue);
    DateMathUI.renderQuick(baseDate, offset, unit);
    URLUtils.updateURL({ tab: 'dateMath', base: baseDateValue, offset: String(offset), unit, quick: true, tz: DateUtils.timezone });
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

  // Restore timezone if present in URL
  if (state.tz) {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: state.tz });
      DateUtils.timezone = state.tz;
      const tzInput = DOMUtils.getById('tzInput');
      if (tzInput) tzInput.value = state.tz;
    } catch {
      // Invalid timezone in URL, ignore
    }
  }

  if (state.base) {
    DOMUtils.setInputValue('baseDate', state.base);
  }

  EventHandlers.switchTab(state.tab);

  if (state.tab === 'dateMath' && state.offset && state.unit) {
    if (state.quick) {
      const baseDateValue = state.base || DateUtils.getTodayISO();
      const baseDate = DateUtils.parseInput(baseDateValue);
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
 * Setup timezone autocomplete dropdown
 */
function initTimezone() {
  const tzInput = DOMUtils.getById('tzInput');
  const tzDropdown = DOMUtils.getById('tzDropdown');
  const timezones = Intl.supportedValuesOf('timeZone');

  tzInput.value = DateUtils.timezone;

  function showFiltered(query) {
    const q = query.toLowerCase();
    const matches = q
      ? timezones.filter(tz => tz.toLowerCase().includes(q)).slice(0, 20)
      : [];

    tzDropdown.innerHTML = '';
    if (matches.length === 0) {
      tzDropdown.classList.remove('show');
      return;
    }

    matches.forEach(tz => {
      const div = document.createElement('div');
      div.className = 'tz-option';
      div.textContent = tz;
      div.addEventListener('mousedown', (e) => {
        e.preventDefault();
        tzInput.value = tz;
        DateUtils.timezone = tz;
        DOMUtils.setInputValue('baseDate', DateUtils.getTodayISO());
        tzDropdown.classList.remove('show');
      });
      tzDropdown.appendChild(div);
    });
    tzDropdown.classList.add('show');
  }

  tzInput.addEventListener('input', () => showFiltered(tzInput.value));
  tzInput.addEventListener('focus', () => {
    if (tzInput.value) showFiltered(tzInput.value);
  });
  tzInput.addEventListener('blur', () => {
    tzDropdown.classList.remove('show');
    // Revert to current tz if input doesn't match
    if (!timezones.includes(tzInput.value)) {
      tzInput.value = DateUtils.timezone;
    }
  });
}

/**
 * Initialize application
 */
function init() {
  // Set base date to today
  DOMUtils.setInputValue('baseDate', DateUtils.getTodayISO());

  // Setup timezone selector
  initTimezone();

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
