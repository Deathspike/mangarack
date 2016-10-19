import * as mio from '../module';

/**
 * Maps the chapters by the chapter metadata derived key.
 * @param chapters The chapters.
 * @param selector The selector.
 * @return The chapters mapped by chapter metadata derived key.
 */
export function mapChapterKey<T>(chapters: mio.IChapter[], selector: (chapter: mio.IChapter) => T): {[metadataDerivedKey: string]: T} {
  let result: {[metadataDerivedKey: string]: T} = {};
  for (let chapter of chapters) {
    result[getMetadataDerivedKey(chapter)] = selector(chapter);
  }
  return result;
}

/**
 * Retrieves the metadata derived key for the chapter.
 * @param chapter The chapter.
 * @return The metadata derived key for the chapter.
 */
function getMetadataDerivedKey(chapter: mio.IChapter): string {
  if (!isFinite(chapter.number)) {
    throw new Error('Invalid chapter number.');
  } else if (!isFinite(chapter.volume)) {
    return `#${chapter.number}`;
  } else {
    return `V${chapter.volume} #${chapter.number}`;
  }
}
