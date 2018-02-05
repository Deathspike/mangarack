import * as Hammer from 'hammerjs';

// TODO: Clean up.
export function pinchZoom(el: HTMLElement) {
  let mc = new Hammer.Manager(el);
  let pinch = new Hammer.Pinch();
  let pan = new Hammer.Pan();

  pinch.recognizeWith(pan);
  mc.add([pinch, pan]);

  let adjustScale = 1;
  let adjustDeltaX = 0;
  let adjustDeltaY = 0;

  let currentScale = 0;
  let currentDeltaX = 0;
  let currentDeltaY = 0;
  let panDelay = 0;

  mc.on('pan pinch', ev => {
    if (ev.type === 'pan' && panDelay >= Date.now()) return;
    currentScale = Math.min(Math.max(1, adjustScale * ev.scale), 2);
    currentDeltaX = adjustDeltaX + (ev.deltaX / currentScale);
    currentDeltaY = adjustDeltaY + (ev.deltaY / currentScale);

    let limitX = el.clientWidth * (currentScale - 1) / 4;
    if (currentDeltaX < -limitX) currentDeltaX = -limitX;
    if (currentDeltaX > limitX) currentDeltaX = limitX;

    let limitY = el.clientHeight * (currentScale - 1) / 4;
    if (currentDeltaY < -limitY) currentDeltaY = -limitY;
    if (currentDeltaY > limitY) currentDeltaY = limitY;

    el.style.transform = `scale(${currentScale}) translate(${currentDeltaX}px,${currentDeltaY}px)`;
  });

  mc.on('panend pinchend', ev => {
      adjustScale = currentScale;
      adjustDeltaX = currentDeltaX;
      adjustDeltaY = currentDeltaY;
      if (ev.type === 'pinchend') panDelay = Date.now() + 200;
  });
}
