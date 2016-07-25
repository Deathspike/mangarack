'use strict';

(function(): void {
  clearStyles();
  loadScriptSync('fastclick/lib/fastclick.js');
  loadScriptSync('react/dist/react-with-addons.min.js');
  loadScriptSync('react-dom/dist/react-dom.min.js');
  loadStyle('normalize.css/normalize.css');
  loadStyle('font-awesome/css/font-awesome.css');
  loadStyle('css/app.css');
  loadStyle('css/mobile.css');

  /**
   * Remove existing styles.
   */
  function clearStyles(): void {
    for (let i = document.head.children.length - 1; i >= 0; i--) {
      let child = document.head.children[i];
      if (/^style$/i.test(child.tagName)) {
        document.head.removeChild(child);
      }
    }
  }

  /**
   * Synchronously fetches file contents.
   * @param filePath The file path.
   * @return The file contents.
   */
  function fetchSync(filePath: string): string {
    let assetsOverrides = (window as any).assetsOverrides;
    if (assetsOverrides && assetsOverrides[filePath]) {
      return assetsOverrides[filePath];
    } else {
      let request = new XMLHttpRequest();
      request.open('GET', filePath, false);
      request.send();
      return request.responseText || '';
    }
  }

  /**
   * Synchronously loads the script.
   * @param filePath The file path.
   */
  function loadScriptSync(filePath: string): void {
    (new Function(fetchSync(filePath)))();
  }

  /**
   * Loads the style.
   * @param filePath The file path.
   */
  function loadStyle(filePath: string): void {
    let link = document.createElement('link');
    link.href = filePath;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
})();
