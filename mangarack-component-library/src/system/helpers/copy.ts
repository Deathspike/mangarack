import * as mio from '../module';

/**
 * Copies chapter metadata.
 * @internal
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
 * @internal
 * @param metadata The metadata.
 * @return The metadata copy.
 */
export function copySeriesMetadata(metadata: mio.ISeriesMetadata): mio.ISeriesMetadata {
  return {
    artists: metadata.artists,
    authors: metadata.authors,
    genres: metadata.genres,
    summary: metadata.summary,
    title: metadata.title,
    type: metadata.type
  };
}
