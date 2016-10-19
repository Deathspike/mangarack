import * as mio from '../default';
let anyGenreType: {[key: string]: mio.GenreType} = mio.GenreType as any;

/**
 * Converts each string value to the genre type.
 * @param value Each value.
 * @return Each genre type.
 */
export function toGenreType(values: string[]): mio.GenreType[] {
  return values.map(value => anyGenreType[normalize(value)]).filter(value => value);
}

/**
 * Normalizes the string value to match the enumerator notation.
 * @param value The value.
 * @return The normalized value.
 */
function normalize(value: string): string {
  return value.replace(/\s([a-zA-Z])/g, function(match: string, character: string): string {
    return character.toUpperCase() + match.substr(2);
  });
}
