'use strict';

(function(): void {
  createReferences([
    'fastclick/lib/fastclick.js',
    'react/dist/react-with-addons.min.js',
    'react-dom/dist/react-dom.min.js'
  ], [
    'normalize.css/normalize.css',
    'font-awesome/css/font-awesome.css',
    'css/app.css',
    'css/mobile.css'
  ]);

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
   * Creates script and style references.
   * @param scripts The scripts.
   * @param styles The styles.
   */
  function createReferences(scripts: string[], styles: string[]): void {
    clearStyles();
    scripts.forEach(loadScriptSync);
    styles.forEach(loadStyleSync);
  }

  /**
   * Synchronously fetches file contents.
   * @param filePath The file path.
   * @return The file contents.
   */
  function fetchSync(filePath: string): string {
    if (window.assetOverrides && window.assetOverrides[filePath]) {
      return window.assetOverrides[filePath];
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
    (new Function(fetchSync(filePath))).call(window);
  }

  /**
   * Synchronously loads the style.
   * @param filePath The file path.
   */
  function loadStyleSync(filePath: string): void {
    let style = document.createElement('style');
    style.innerHTML = fetchSync(filePath);
    document.head.appendChild(style);
  }
})();
