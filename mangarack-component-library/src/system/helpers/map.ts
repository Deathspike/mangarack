import * as mio from '../module';

/**
 * Maps the chapters by the metadata derived key.
 * @param chapters The chapters.
 * @param selector The selector.
 * @return The chapters mapped by metadata derived key.
 */
export function mapChaptersByKey<T>(chapters: mio.IChapter[], selector: (chapter: mio.IChapter) => T): {[metadataDerivedKey: string]: T} {
  let result: {[metadataDerivedKey: string]: T} = {};
  for (let chapter of chapters) {
    result[getDerivedMetadataKey(chapter)] = selector(chapter);
  }
  return result;
}

/**
 * Retrieves the metadata derived key for the chapter.
 * @param chapter The chapter.
 * @return The metadata derived key for the chapter.
 */
function getDerivedMetadataKey(chapter: mio.IChapter): string {
  if (chapter.volume.value == null) {
    return `#${chapter.number.value}`;
  } else {
    return `V${chapter.volume.value} #${chapter.number.value}`;
  }
}
