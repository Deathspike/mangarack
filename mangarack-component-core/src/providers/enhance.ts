'use strict';
import * as mio from '../default';

/**
 * Enhances the chapter numbering when applicable.
 * @param chapters The chapters.
 * @return The chapters with enhanced chapter numbering.
 */
export function enhance(chapters: mio.IChapter[]): mio.IChapter[] {
  return chapters.map(chapter => chapter.number.value != null ? chapter : {
    pagesAsync: chapter.pagesAsync,
    number: estimateNumber(chapters, chapter),
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
  // Initialize the differences and previous chapter.
  let differences: {[key: string]: number} = {};
  let hasDifferences = false;
  let previousChapter: mio.IChapter;

  // Compute the differences between the chapters within contained in the same volume.
  for (let currentChapter of chapters.filter(chapter => chapter.number.value != null && chapter.volume === targetChapter.volume)) {
    if (previousChapter) {
      let difference = (currentChapter.number.value - previousChapter.number.value).toFixed(4);
      differences[difference] = (differences[difference] || 0) + 1;
      hasDifferences = true;
    }
    previousChapter = currentChapter;
  }

  // Return an estimated chapter number, or null.
  if (hasDifferences) {
    return mio.option(previousChapter.number.value + (limitNumber(prioritizeDifference(differences), 0, 1) / 2));
  } else if (previousChapter) {
    return mio.option(previousChapter.number.value + 0.5);
  } else {
    return mio.option<number>();
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
  let best: {amount: mio.IOption<number>, count: mio.IOption<number>} = {amount: mio.option<number>(), count: mio.option<number>()};
  for (let difference in differences) {
    if (differences.hasOwnProperty(difference)) {
      let count = differences[difference];
      if (best.count.value == null || differences[difference] > best.count.value) {
        best.amount = mio.option(difference);
        best.count = mio.option(count);
      }
    }
  }
  return best.amount.value || 0;
}
