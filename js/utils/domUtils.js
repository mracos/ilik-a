/**
 * DOM utility functions for element manipulation
 */

export const DOMUtils = {
  /**
   * Get element by ID
   * @param {string} id - Element ID
   * @returns {HTMLElement} The element
   */
  getById(id) {
    return document.getElementById(id);
  },

  /**
   * Get input value by ID
   * @param {string} id - Input element ID
   * @returns {string} Input value
   */
  getInputValue(id) {
    return this.getById(id).value;
  },

  /**
   * Set input value by ID
   * @param {string} id - Input element ID
   * @param {string} value - Value to set
   */
  setInputValue(id, value) {
    this.getById(id).value = value;
  },

  /**
   * Set element HTML content
   * @param {string} id - Element ID
   * @param {string} html - HTML content
   */
  setHTML(id, html) {
    this.getById(id).innerHTML = html;
  },

  /**
   * Set element CSS class
   * @param {string} id - Element ID
   * @param {string} className - CSS class name
   */
  setClass(id, className) {
    this.getById(id).className = className;
  },

  /**
   * Display result in result div
   * @param {string} id - Result div ID
   * @param {string} html - HTML content
   * @param {boolean} highlight - Whether to apply highlight class
   */
  showResult(id, html, highlight = false) {
    this.setHTML(id, html);
    this.setClass(id, highlight ? 'result highlight' : 'result');
  },

  /**
   * Display error message in result div
   * @param {string} id - Result div ID
   * @param {string} message - Error message
   */
  showError(id, message) {
    this.showResult(id, message, false);
  }
};
