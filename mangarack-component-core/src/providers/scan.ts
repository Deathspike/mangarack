import * as mio from '../default';
const regexp = new RegExp('\\s*' +
  // The volume expression [1].
  '(?:Vol\\.?\\s*([0-9\\.]+)\\s*)?' +
  // The chapter expression [2].
  '(?:(?:Ch|Ep)\\.?)?[a-z]*\\s*(?:([0-9\\.]+[a-u]?)\\s*(?:Extra)?\\s*(?:Omake)?)' +
  // The dash versioning skip expression.
  '(?:\\s*-\\s*[0-9\\.]+)?' +
  // The versioning expression [3].
  '(?:\\s*v\\.?([0-9]+))?' +
  // The part expression [4].
  '(?:\\s*\\(?Part\\s*([0-9]+)\\)?)?' +
  // The dash/plus skip expression.
  '(?:\\s*(?:-|\\+))?' +
  // The title expression [5].
  '(?:\\s*\\:?\\s*(?:(?:[\\w\\W]*)Read Onl?ine(?:[\\w\\W]*)|([\\w\\W]*)))?' +
  // The whitespace expression.
  '\\s*$', 'i');

/**
 * Scans the input for chapter metadata.
 * @param input The input to scan.
 * @return The chapter metadata.
 */
export function scan(input: string): mio.IChapterMetadata {
  let match = input.match(regexp);
  if (match) {
    return createMetadata(match);
  } else {
    throw new Error(`Invalid scan input: ${input}`);
  }
};

/**
 * Creates the chapter metadata.
 * @param match The expression result.
 * @return The chapter metadata.
 */
function createMetadata(match: RegExpMatchArray): mio.IChapterMetadata {
  return {
    number: ensureNumber(createNumber(match[2], match[4])),
    title: match[5] ? match[5].trim() : '',
    version: ensureNumber(parseFloat(match[3])),
    volume: ensureNumber(parseFloat(match[1]))
  };
}

/**
 * Creates the chapter number from the chapter expression result and part expression result.
 * @param chapter The chapter expression result.
 * @param part The part expression result.
 * @return The chapter number.
 */
function createNumber(chapter: string, part: string): number {
  let match = chapter.match(/^(.*)([a-u])$/);
  if (match) {
    return parseFloat(match[1]) + (match[2].charCodeAt(0) - 96) / 10;
  } else if (part) {
    let parsedPart = parseFloat(part);
    return parseFloat(chapter) + (parsedPart || 0) / 10;
  } else {
    return parseFloat(chapter);
  }
}

/**
 * Ensures the value is a valid number.
 * @param value The number.
 * @return The number.
 */
function ensureNumber(value: number): mio.IOption<number> {
  if (isFinite(value)) {
    return value;
  } else {
    return undefined;
  }
}
