import * as mio from '../default';

/**
 * Enhances the chapter numbering when applicable.
 * @param chapters The chapters.
 * @return The chapters with enhanced chapter numbering.
 */
export function enhance(chapters: mio.IChapter[]): mio.IChapter[] {
  return chapters.map(chapter => isFinite(chapter.number) ? chapter : {
    number: estimateNumber(chapters, chapter),
    pagesAsync: chapter.pagesAsync,
    title: chapter.title,
    version: chapter.version,
    volume: chapter.volume
  });
}

/**
 * Estimates the chapter number for the target chapter.
 * @param chapters The chapters.
 * @param target The target chapter.
 * @return The estimated chapter number.
 */
function estimateNumber(chapters: mio.IChapter[], targetChapter: mio.IChapter): mio.IOption<number> {
  let differences: {[key: string]: number} = {};
  let previousChapter: mio.IOption<mio.IChapter>;
  for (let currentChapter of chapters.filter(chapter => isFinite(chapter.number) && chapter.volume === targetChapter.volume)) {
    if (previousChapter) {
      let difference = (currentChapter.number - previousChapter.number).toFixed(4);
      differences[difference] = (differences[difference] || 0) + 1;
    }
    previousChapter = currentChapter;
  }
  return finalizeDifference(differences, previousChapter);
}

/**
 * Finalizes the differences.
 * @param differences The differences.
 * @param previousChapter The previous chapter.
 * @return The estimated chapter number.
 */
function finalizeDifference(differences: {[key: string]: number}, previousChapter: mio.IOption<mio.IChapter>): mio.IOption<number> {
  if (previousChapter) {
    let add = Object.keys(differences).length ? (limitNumber(prioritizeDifference(differences), 0, 1) / 2) : 0.5;
    let value = previousChapter.number + add;
    return isFinite(value) ? value : undefined;
  } else {
    return undefined;
  }
}

/**
 * Limits the current value to the specified minimum and maximum values.
 * @param current The current value.
 * @param minimum The minimum value.
 * @param maximum The maximum value.
 * @return The current value limited to the specified minimum and maximum values.
 */
function limitNumber(current: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(current, minimum), maximum) || maximum;
}

/**
 * Prioritizes the best difference.
 * @param differences The differences.
 * @return The best difference.
 */
function prioritizeDifference(differences: {[key: string]: number}): number {
  let best: {amount?: number, count?: number} = {};
  for (let difference in differences) {
    if (differences.hasOwnProperty(difference)) {
      let count = differences[difference];
      if (!best.count || differences[difference] > best.count) {
        best.amount = parseFloat(difference);
        best.count = count;
      }
    }
  }
  return best.amount || 0;
}
