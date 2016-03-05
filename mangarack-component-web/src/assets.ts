'use strict';

(function(): void {
  clearStyles();
  loadScriptSync('js/lib/fastclick-1.0.6.min.js');
  loadScriptSync('js/lib/react-0.14.7.min.js');
  loadScriptSync('js/lib/react-dom-0.14.7.min.js');
  loadStyleSync('css/lib/normalize-3.0.3.min.css');
  loadStyleSync('css/lib/font-awesome-4.5.0.min.css');
  loadStyleSync('css/app.css');
  loadStyleSync('css/mobile.css');

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
   * Synchronously loads the style.
   * @param filePath The file path.
   */
  function loadStyleSync(filePath: string): void {
    let style = document.createElement('style');
    style.innerHTML = fetchSync(filePath);
    document.head.appendChild(style);
  }
})();
