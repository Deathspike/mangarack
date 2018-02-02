export async function processMangafoxImageAsync(blob: Blob) {
  let image = await getImageAsync(blob);
  let canvas = document.createElement('canvas');
  canvas.height = image.height;
  canvas.width = image.width;
  
  let context = canvas.getContext('2d');
  if (context == null) throw new Error('Invalid image context');
  context.drawImage(image, 0, 0, image.width, image.height);

  let imageData = context.getImageData(0, 0, image.width, image.height);
  let cropLines = readNumberOfCropLines(imageData.data, image.height, image.width);
  if (cropLines) {
    canvas.height -= cropLines;
    context.putImageData(imageData, 0, 0);
  }

  return canvas.toDataURL();
}

function getImageAsync(blob: Blob) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    let image = new Image();
    image.addEventListener('error', reject);
    image.addEventListener('load', () => resolve(image));
    image.src = URL.createObjectURL(blob);
  });
}

function readLineAverageOrContainsBlack(imageData: Uint8ClampedArray, width: number, y: number) {
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

function readNumberOfCropLines(imageData: Uint8ClampedArray, height: number, width: number) {
  let count = -1;
  let firstBlackY = -1;
  let lastBlackY = -1;
  for (let y = 0; y < 80 && y < height; y += 1) {
    let line = readLineAverageOrContainsBlack(imageData, width, height - y - 1);
    if (!line) {
      if (y !== 0) {
        firstBlackY = firstBlackY === -1 ? (firstBlackY > 5 ? 5 : y) : firstBlackY;
        lastBlackY = y;
      } else {
        return 0;
      }
    } else if (lastBlackY !== -1 && line.r >= 245 && line.g >= 245 && line.b >= 245) {
      count = firstBlackY + lastBlackY;
    }
  }
  return count;
}
