'use strict';
import * as mio from '../default';
let anyGenreType: {[key: string]: mio.GenreType} = mio.GenreType as any;

/**
 * Converts the/each string value to the genre type, or null.
 * @param value The/each value.
 * @return The/each genre type, or null.
 */
export function toGenreType(values: string[]): mio.GenreType[] {
  return values
    .map(value => mio.option(anyGenreType[normalize(value)]))
    .filter(optional => optional.value != null)
    .map(optional => optional.value);
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
