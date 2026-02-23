/**
 * URL state management for shareable links
 */

export const URLUtils = {
  /**
   * Read calculation state from URL query params
   * @returns {Object|null} State object or null if no params
   */
  readState() {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');

    if (!tab) return null;

    const state = { tab, base: params.get('base') };

    if (tab === 'dateMath') {
      state.offset = params.get('offset');
      state.unit = params.get('unit');
      state.quick = params.has('quick');
    } else if (tab === 'age') {
      state.birth = params.get('birth');
    }

    return state;
  },

  /**
   * Update URL with calculation state (without page reload)
   * @param {Object} state - State to encode
   */
  updateURL(state) {
    const params = new URLSearchParams();
    params.set('tab', state.tab);

    if (state.base) params.set('base', state.base);

    if (state.tab === 'dateMath') {
      if (state.offset) params.set('offset', state.offset);
      if (state.unit) params.set('unit', state.unit);
      if (state.quick) params.set('quick', '1');
    } else if (state.tab === 'age') {
      if (state.birth) params.set('birth', state.birth);
    }

    const url = `${window.location.pathname}?${params.toString()}`;
    history.replaceState(null, '', url);
  },

  /**
   * Copy current URL to clipboard
   * @returns {Promise<boolean>} Whether copy succeeded
   */
  async copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      return true;
    } catch {
      return false;
    }
  }
};
