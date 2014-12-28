/**
 * Represents options.
 * @interface
 */
var IOptions = {};

// --

/**
 * Disable image animation framing.
 * @type {?boolean}
 */
IOptions.animation = Boolean();

/**
 * Disable duplication detection.
 * @type {?boolean}
 */
IOptions.duplication = Boolean();

/**
 * Disable image footer cropping (MangaFox-only).
 * @type {?boolean}
 */
IOptions.footer = Boolean();

/**
 * Disable image generalization.
 * @type {?boolean}
 */
IOptions.generalize = Boolean();

/**
 * Disable the comic book jacket/cover.
 * @type {?boolean}
 */
IOptions.jacket = Boolean();

/**
 * Disable metadata.
 * @type {?boolean}
 */
IOptions.meta = Boolean();

// --

/**
 * The chapter filter.
 * @type {?number}
 */
IOptions.chapter = Number();

/**
 * The volume filter.
 * @type {?number}
 */
IOptions.volume = Number();

// --

/**
 * The file extension. (Default: cbz)
 * @type {?string}
 */
IOptions.extension = String('cbz');

/**
 * The output directory.
 * @type {?string}
 */
IOptions.output = String();

/**
 * The source file. (Default: MangaRack.txt)
 * @type {?string}
 */
IOptions.source = String('MangaRack.txt');

/**
 * The image transformation output.
 * @type {?string}
 */
IOptions.transform = String();

/**
 * The maximum workers. (Default: # cores)
 * @type {?number}
 */
IOptions.workers = Number();

// --

module.exports = IOptions;
