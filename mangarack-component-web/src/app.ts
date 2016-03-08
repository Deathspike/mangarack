/* TODO: [Menu] Add a 'Reset All' button to the genre filters. */
/* TODO: [Menu] Disable genre filter button when filtering would have no further effect. */
/* TODO: [Menu] Consider swapping ascending/descending on first click. */
/* TODO: [Menu] Consider storing the filter/order state in local storage. */
/* TODO: [Menu] Add a 'Status Filter' for All/Read/Reading/Unread. */
/* TODO: [Chapter] 'Continue reading'-button */
/* TODO: [Chapter] 'Order By'-filter */
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
