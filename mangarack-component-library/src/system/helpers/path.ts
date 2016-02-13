/**
 * Retrieves the path to the context.
 * @return The path to the context.
 */
export function pathOf(): string {
  return 'db.mrx';
}

/**
 * Retrieves the path to the chapter.
 * @param seriesId The series identifier.
 * @param chapterId The chapter identifier.
 * @return The path to the chapter.
 */
export function pathOfChapter(seriesId: number, chapterId: number): string {
  return `${seriesId}/${chapterId}`;
}

/**
 * Retrieves the path to the page image.
 * @param seriesId The series identifier.
 * @param chapterId The chapter identifier.
 * @param pageNumber The page number.
 * @return The path to the page image.
 */
/*export function pathOfPageImage(seriesId: number, chapterId: number, pageNumber: number): string {
  return `${seriesId}/${chapterId}/${pageNumber}.mrx`;
}*/

/**
 * Retrieves the path to the series.
 * @param seriesId The series identifier.
 * @return The path to the series.
 */
export function pathOfSeries(seriesId: number) {
  return `${seriesId}`;
}

/**
 * Retrieves the path to the series preview image.
 * @param seriesId The series identifier.
 * @return The path to the series preview image.
 */
export function pathOfSeriesPreviewImage(seriesId: number): string {
  return `${seriesId}/preview.mrx`;
}
