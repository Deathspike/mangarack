export async function mangafoxImageAsync(buffer: Blob) {
  // Initialize the image and canvas.
  let image = await convertImageAsync(buffer);
  let imageCanvas = document.createElement('canvas');
  imageCanvas.height = image.height;
  imageCanvas.width = image.width;
  
  // Initialize the image context.
  let imageContext = imageCanvas.getContext('2d');
  if (!imageContext) throw new Error('Invalid image context');
  imageContext.drawImage(image, 0, 0, image.width, image.height);

  // Initialize the image data.
  let imageData = imageContext.getImageData(0, 0, image.width, image.height);
  let numberOfCropLines = fetchNumberOfCropLines(imageData.data, image.height, image.width);
  if (!numberOfCropLines) return imageCanvas.toDataURL();

  // Process the image.
  imageCanvas.height -= numberOfCropLines;
  imageContext.putImageData(imageData, 0, 0);
  return imageCanvas.toDataURL();
}

function convertImageAsync(buffer: Blob) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    let image = new Image();
    image.addEventListener('error', reject);
    image.addEventListener('load', () => resolve(image));
    image.src = URL.createObjectURL(buffer);
  });
}

function fetchAverageOrContainsBlack(imageData: Uint8ClampedArray, width: number, y: number) {
  let totals = {b: 0, g: 0, r: 0};
  for (let x = 0, index = y * width * 4; x < width; x++, index += 4) {
    let r = imageData[index];
    let g = imageData[index + 1];
    let b = imageData[index + 2];
    if (r >= 45 && g >= 45 && b >= 45) {
      totals.r += r;
      totals.g += g;
      totals.b += b;
    } else {
      return undefined;
    }
  }
  return {b: Math.round(totals.b / width), g: Math.round(totals.g / width), r: Math.round(totals.r / width)};
}

function fetchNumberOfCropLines(imageData: Uint8ClampedArray, height: number, width: number) {
  let count = -1;
  let firstBlackY = -1;
  let lastBlackY = -1;
  for (let y = 0; y < 80 && y < height; y += 1) {
    let line = fetchAverageOrContainsBlack(imageData, width, height - y - 1);
    if (!line) {
      if (y === 0) return 0;
      firstBlackY = firstBlackY === -1 ? (firstBlackY > 5 ? 5 : y) : firstBlackY;
      lastBlackY = y;
    } else if (lastBlackY !== -1 && line.r >= 245 && line.g >= 245 && line.b >= 245) {
      count = firstBlackY + lastBlackY;
    }
  }
  return count;
}
