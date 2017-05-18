import * as mio from '../module';

/**
 * Copies chapter metadata.
 * @param metadata The metadata.
 * @return The metadata copy.
 */
export function copyChapterMetadata(metadata: mio.IChapterMetadata): mio.IChapterMetadata {
  return {
    number: metadata.number,
    title: metadata.title,
    version: metadata.version,
    volume: metadata.volume
  };
}

/**
 * Copies series metadata.
 * @param metadata The metadata.
 * @return The metadata copy.
 */
export function copySeriesMetadata(metadata: mio.ISeriesMetadata): mio.ISeriesMetadata {
  return {
    artists: metadata.artists.map(artist => artist),
    authors: metadata.authors.map(author => author),
    genres: metadata.genres.map(genre => genre),
    summary: metadata.summary,
    title: metadata.title,
    type: metadata.type
  };
}
