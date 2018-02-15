import * as Hammer from 'hammerjs';

// [Improvement] Zoom with constraints of the image instead of the container.
// [Improvement] Zoom to the center of the pinch (ev.center).
// [Improvement] Zoom to a higher scale than two.
export class TouchManager {
  private _adjustScale = 1;
  private _adjustDeltaX = 0;
  private _adjustDeltaY = 0;
  private _currentScale = 0;
  private _currentDeltaX = 0;
  private _currentDeltaY = 0;
  private _element?: HTMLElement;
  private _elementManager?: HammerManager;
  private _panTime = 0;
  private _tapEvent?: (x: number, y: number) => void;

  constructor(tapEvent?: (x: number, y: number) => void) {
    this._tapEvent = tapEvent;
  }

  attachWithPinchZoom(element: HTMLElement) {
    if (!this._elementManager) {
      // Initialize each gesture.
      let pinch = new Hammer.Pinch();
      let pan = new Hammer.Pan();
      let tap = new Hammer.Tap();
      pinch.recognizeWith(pan);

      // Initialize the element and manager.
      this._element = element;
      this._elementManager = new Hammer.Manager(element);

      // Attach each gesture and event.
      this._elementManager.add([pinch, pan, tap]);
      this._elementManager.on('pan pinch', ev => this._move(ev));
      this._elementManager.on('panend pinchend', ev => this._end(ev));
      this._elementManager.on('tap', ev => this._tap(ev));
    }
  }

  detach() {
    if (this._elementManager) {
      this._elementManager.destroy();
      this._elementManager = undefined;
    }
  }

  reset() {
    this._adjustScale = this._currentScale = 1;
    this._adjustDeltaX = this._currentDeltaX = 0;
    this._adjustDeltaY = this._currentDeltaY = 0;
    this._update();
  }

  private _end(ev: HammerInput) {
    this._adjustScale = this._currentScale;
    this._adjustDeltaX = this._currentDeltaX;
    this._adjustDeltaY = this._currentDeltaY;
    this._panTime = ev.type === 'pinchend' ? Date.now() + 200 : 0;
  }
  
  private _move(ev: HammerInput) {
    if (this._element && (this._panTime < Date.now() || ev.type !== 'pan')) {
      // Compute the scale and each delta.
      this._currentScale = Math.min(Math.max(1, this._adjustScale * ev.scale), 2);
      this._currentDeltaX = Math.round(this._adjustDeltaX + (ev.deltaX / this._currentScale));
      this._currentDeltaY = Math.round(this._adjustDeltaY + (ev.deltaY / this._currentScale));

      // Compute and restrict the x-axis boundaries.
      let limitX = Math.round(this._element.clientWidth * (this._currentScale - 1) / 4);
      if (this._currentDeltaX < -limitX) this._currentDeltaX = -limitX;
      if (this._currentDeltaX > limitX) this._currentDeltaX = limitX;

      // Compute and restrict the y-axis boundaries.
      let limitY = Math.round(this._element.clientHeight * (this._currentScale - 1) / 4);
      if (this._currentDeltaY < -limitY) this._currentDeltaY = -limitY;
      if (this._currentDeltaY > limitY) this._currentDeltaY = limitY;
      this._update();
    }
  }

  private _tap(ev: HammerInput) {
    if (this._tapEvent) {
      this._tapEvent(ev.center.x, ev.center.y);
    }
  }

  private _update() {
    if (this._element) {
      let scale = `scale(${this._currentScale})`;
      let translate = `translate(${this._currentDeltaX}px,${this._currentDeltaY}px)`;
      this._element.style.transform = `${scale} ${translate}`;
    }
  }
}
