(function() {
  /**
   * Evaluates the page. Cannot validate invalid `nextPageUrl`.
   * @param {Window} window
   * @returns {IEvaluatorPage}
   */
  function evaluatePage(window) {
    return {
      imageUrl: getImageUrl(),
      nextPageUrl: getNextPageUrl(),
    };

    /**
     * Retrieves the image url.
     * @returns {string}
     */
    function getImageUrl() {
      let img = window.document.querySelector('#viewer img');
      let relativeUrl = wipeString(img && img.getAttribute('src'));
      if (relativeUrl) return new window.URL(relativeUrl, window.location.href).href;
      throw new Error('Invalid page image url');
    }
    
    /**
     * Retrieves the next page url.
     * @returns {string | undefined}
     */
    function getNextPageUrl() {
      let anchor = window.document.querySelector('a.next_page');
      let relativeUrl = wipeString(anchor && anchor.getAttribute('href'));
      if (relativeUrl) return /\.html$/.test(relativeUrl) ? new window.URL(relativeUrl, window.location.href).href : undefined;
      throw new Error('Invalid next page url');
    }

    /**
     * Wipes the string.
     * @param {string | null} value
     * @returns {string}
     */
    function wipeString(value) {
      return value && value.trim().replace(/\s+/g, ' ') || '';
    }
  }

  if (typeof exports !== 'undefined') {
    return exports.evaluatePage = evaluatePage;
  } else {
    return evaluatePage(window);
  } 
})();
