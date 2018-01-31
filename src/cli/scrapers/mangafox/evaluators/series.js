(function() {
  /**
   * Evaluates the series.
   * @param {Window} window
   * @returns {IEvaluatorSeries}
   */
  function evaluateSeries(window) {
    return {
      artists: getArtists(),
      authors: getAuthors(),
      chapters: getChapters(),
      genres: getGenres(),
      imageUrl: getImageUrl(),
      name: getName(),
      summary: getSummary(),
      type: getType(),
      url: getUrl()
    };

    /**
     * Retrieves each artist.
     * @returns {string[]}
     */
    function getArtists() {
      let anchors = Array.from(window.document.querySelectorAll('#title a[href*=\'/search/artist/\']'));
      let texts = wipeArray(anchors.map(anchor => anchor.textContent));
      if (texts.length > 0) return texts;
      throw new Error('Invalid series artists');
    }

    /**
     * Retrieves each author.
     * @returns {string[]}
     */
    function getAuthors() {
      let anchors = Array.from(window.document.querySelectorAll('#title a[href*=\'/search/author/\']'));
      let texts = wipeArray(anchors.map(anchor => anchor.textContent));
      if (texts.length > 0) return texts;
      throw new Error('Invalid series authors');
    }

    /**
     * Retrieves each chapter.
     * @returns {IEvaluatorSeriesChapter[]}
     */
    function getChapters() {
      let results = makeSeriesChapterArray();
      let h3s = Array.from(window.document.querySelectorAll('#chapters h3.volume'));
      h3s.forEach(h3 => {
        let volumeMatch = wipeString(h3.textContent).match(/^Volume\s(.+)$/i);
        if (volumeMatch) {
          let ul = h3.parentElement && h3.parentElement.nextElementSibling;
          if (ul && /^ul$/i.test(ul.nodeName)) {
            let anchors = Array.from(ul.querySelectorAll('a[href*=\'/manga/\']'));
            let volume = volumeMatch[1] ? parseFloat(volumeMatch[1]) : NaN;
            anchors.forEach(anchor => {
              let relativeUrl = wipeString(anchor.getAttribute('href'));
              if (relativeUrl) {
                let numberMatch = wipeString(anchor.textContent).match(/[0-9\.]+$/);
                let number = numberMatch ? parseFloat(numberMatch[0]) : NaN;
                if (isFinite(number)) {
                  let absoluteUrl = new window.URL(relativeUrl, window.location.href).href;
                  let name = wipeString(anchor.nextElementSibling && anchor.nextElementSibling.textContent);
                  results.push({
                    name: name && !/^Read Onl?ine$/i.test(name) ? name : undefined,
                    number: number,
                    url: absoluteUrl + (/[0-9]+\.html$/i.test(absoluteUrl) ? '' : '1.html'),
                    volume: isFinite(volume) ? volume : undefined
                  });
                }
              }
            });
          }
        }
      });
      if (results.length > 0 ) return results.reverse();
      throw new Error('Invalid series items');
    }

    /**
     * Retrieves each genre.
     * @returns {string[]}
     */
    function getGenres() {
      let anchors = Array.from(window.document.querySelectorAll('#title a[href*=\'/search/genres/\']'));
      let texts = wipeArray(anchors.map(anchor => anchor.textContent));
      if (texts.length > 0) return texts;
      throw new Error('Invalid series genres');
    }

    /**
     * Retrieves the image url.
     * @returns {string}
     */
    function getImageUrl() {
      let img = window.document.querySelector('.cover img');
      let relativeUrl = wipeString(img && img.getAttribute('src'));
      if (relativeUrl) return new window.URL(relativeUrl, window.location.href).href;
      throw new Error('Invalid series image url');
    }

    /**
     * Retrieves the name.
     * @returns {string}
     */
    function getName() {
      let title = window.document.querySelector('title');
      let match = wipeString(title && title.textContent && title.textContent).match(/^(.+)\s+Manga\s+-/i);
      if (match) return match[1];
      throw new Error('Invalid series name');
    }

    /**
     * Retrieves the summary.
     * @returns {string}
     */
    function getSummary() {
      let p = window.document.querySelector('#title p.summary');
      let texts = wipeArray(p && p.textContent && p.textContent.split('\n') || []);
      let piece = texts.find(text => !/:$/i.test(text) && !/^From\s+(.+)$/i.test(text) && !/^\(Source:\s+(.+)\)/i.test(text));
      if (piece) return piece;
      throw new Error('Invalid series summary');
    }
    
    /**
     * Retrieves the type.
     * @returns {string}
     */
    function getType() {
      let h1 = window.document.querySelector('#title h1');
      let match = wipeString(h1 && h1.textContent && h1.textContent).match(/(Manga|Manhwa|Manhua)$/);
      if (match) return match[0];
      throw new Error('Invalid series type');
    }
    
    /**
     * Retrieves the url.
     * @returns {string}
     */
    function getUrl() {
      return window.location.href;
    }

    /**
     * Makes the series chapter array.
     * @returns {IEvaluatorSeriesChapter[]}
     */
    function makeSeriesChapterArray() {
      return [];
    }

    /**
     * Wipes the array.
     * @param {Array<string | null>} values 
     * @returns {Array<string>}
     */
    function wipeArray(values) {
      return values && values.map(value => wipeString(value)).filter(value => Boolean(value)) || [];
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
    return exports.evaluateSeries = evaluateSeries;
  } else {
    return evaluateSeries(window);
  }
})();
