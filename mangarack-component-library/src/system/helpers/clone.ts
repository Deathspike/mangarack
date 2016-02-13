import * as mio from '../module';

/**
 * Clones chapter metadata.
 * @param metadata The metadata.
 * @return The metadata clone.
 */
export function cloneChapter(metadata: mio.IChapterMetadata): mio.IChapterMetadata {
  return {
    number: metadata.number,
    title: metadata.title,
    version: metadata.version,
    volume: metadata.volume
  };
}

/**
 * Clones series metadata.
 * @param metadata The metadata.
 * @return The metadata clone.
 */
export function cloneSeries(metadata: mio.ISeriesMetadata): mio.ISeriesMetadata {
  return {
    artists: metadata.artists,
    authors: metadata.authors,
    genres: metadata.genres,
    summary: metadata.summary,
    title: metadata.title,
    type: metadata.type
  };
}
