'use strict';

(function(): void {
  if (typeof require === 'undefined') {
    let request = new XMLHttpRequest();
    request.open('GET', 'js/require.js', false);
    request.send();
    (new Function(request.responseText))();
  }
})();

(function(): void {
  require('./default');
})();
