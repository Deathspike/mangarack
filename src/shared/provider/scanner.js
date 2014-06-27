// Enable restricted mode.
'use strict';
// Initialize the parse number function.
var parseNumber;
// Initialize the regular expression ...
var regex = new RegExp('\\s*' +
    // ... with the volume expression [1] ...
    '(?:Vol\\.?\\s*([0-9\\.]+)\\s*)?' +
    // ... with the chapter expression [2] ...
    '(?:Ch\\.?)?[a-z]*\\s*((?:[0-9\\.]+[a-u]?)\\s*(?:Extra)?\\s*(?:Omake)?)' +
    // ... with the dash versioning skip expression ...
    '(?:\\s*-\\s*[0-9\\.]+)?' +
    // ... with the versioning skip expression ...
    '(?:\\s*v\\.?[0-9]+)?' +
    // ... with the part expression [3] ...
    '(?:\\s*\\(?Part\\s*([0-9]+)\\)?)?' +
    // ... with the dash/plus skip expression ...
    '(?:\\s*(?:-|\\+))?' +
    // ... with the title expression [4] ...
    '(?:\\s*\\:?\\s*(?:Read Onl?ine|([\\w\\W]*)))?' +
    // ... with the whitespace expression.
    '\\s*$', 'i');

// ==================================================
// Export the function.
// --------------------------------------------------
module.exports = function (input) {
    // Initialize the match.
    var match = input.match(regex);
    // Return the result ...
    return !match ? undefined : {
        // ... with the number ...
        number: parseNumber(match[2], match[3]),
        // ... with the title ...
        title: (match[4] || '').trim(),
        // ... with the volume ...
        volume: parseFloat(match[1])
    };
};

// ==================================================
// Parse the number.
// --------------------------------------------------
parseNumber = function (chapter, part) {
    // Initialize the addition.
    var addition = 0;
    // Initialize the match.
    var match = chapter.match(/([a-u])$/i);
    // Check if the match is valid.
    if (match) {
        // Initialize the addition.
        addition = (match[1].charCodeAt(0) - 96) / 10;
    } else if (part) {
        // Initialize the addition.
        addition = parseFloat(part) / 10;
    }
    // Return the chapter.
    return parseFloat(chapter) + addition;
};
