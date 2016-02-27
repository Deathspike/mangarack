'use strict';

/**
 * Provides a synchronous require implementation for development purposes.
 * @author Roel van Uden
 * @license MIT
 */
let require = (<any> window).require = (function(): any {
  let scriptElement = document.querySelector('script[src$=\'require.js\']');
  let moduleCache: {[key: string]: any} = {};
  let basePath = (scriptElement ? scriptElement.getAttribute('data-base') : null) || 'js';

  /**
   * Synchronously fetches file contents.
   * @param filePath The file path.
   * @return The file contents.
   */
  function fetchSync(filePath: string): string {
    let request = new XMLHttpRequest();
    request.open('GET', filePath, false);
    request.send();
    return request.responseText || '';
  }

  /**
   * Synchronously fetches file contents and initializes a module.
   * @param filePath The file path.
   */
  function fetchAndInitializeModuleSync(filePath: string): any {
    let exports = {};
    let module = {exports: exports, id: filePath, uri: filePath};
    let source = fetchSync(filePath) + '\n//# sourceURL=' + filePath;
    moduleCache[filePath] = exports;
    (new Function('exports', 'module', 'require', source))(exports, module, require);
  }

  /**
   * Resolves a relative file path to an absolute file path.
   * @param relativeFilePath The relative file path.
   * @return The absolute file path.
   */
  function resolve(relativeFilePath: string): string {
    if (!/^\.\.?\//.test(relativeFilePath)) {
      return '/' + relativeFilePath + '/default.js';
    } else {
      let parts = basePath.split('/');
      if (!/\.js$/i.test(relativeFilePath)) {
        relativeFilePath += '.js';
      }
      if (/^\.\//.test(relativeFilePath)) {
        relativeFilePath = relativeFilePath.substr(2);
      }
      while (parts.length && /^\.\.\//.test(relativeFilePath)) {
        relativeFilePath = relativeFilePath.substr(3);
        parts.pop();
      }
      return (parts.length ? parts.join('/') + '/' : '') + relativeFilePath;
    }
  }

  /**
   * Synchronously requires a module at the relative file path.
   * @param relativeFilePath The relative file path.
   * @return The initialized module.
   */
  return function(relativeFilePath: string): any {
    let filePath = resolve(relativeFilePath);
    if (!moduleCache[filePath]) {
      let index = filePath.lastIndexOf('/');
      let previousBasePath = basePath;
      basePath = index >= 0 ? filePath.substr(0, index) : '';
      fetchAndInitializeModuleSync(filePath);
      basePath = previousBasePath;
    }
    return moduleCache[filePath];
  };
})();
