import * as mio from '../default';
let closedModal: {[id: number]: boolean} = {};
let lastModalId = 0;

/**
 * Represents each application action.
 * @internal
 */
export let modalActions = {
  /**
   * Adds a series to the library.
   * @param reviser The address.
   */
  addSeries: wrapReviserAsync('MODAL_ADDSERIES', async function(state: mio.IApplicationState, modalId: number, address: string): Promise<void> {
    let seriesId = await mio.openActiveLibrary().create().runAsync(address);
    if (!seriesId.hasValue) {
      throw new Error(`Invalid series address: ${address}`);
    } else if (!closedModal[modalId]) {
      mio.applicationActions.navigateSeries(seriesId.value);
    }
  }),

  /**
   * Downloads series to the library.
   * @param reviser The address.
   */
  downloadSeries: wrapReviserAsync('MODAL_DOWNLOADSERIES', async function(state: mio.IApplicationState, modalId: number, revision: {existingChapters: boolean, newChapters: boolean}): Promise<void> {
    await mio.openActiveLibrary().download().runAsync(revision.existingChapters, revision.newChapters);
    if (!closedModal[modalId]) {
      mio.applicationActions.refresh();
    }
  }),

  /**
   * Sets the type.
   * @param revisor The type.
   */
  setType: mio.store.reviser('MODAL_SETTYPE', function(state: mio.IApplicationState, modalType: mio.ModalType): void {
    state.modal.type = modalType;
    if (modalType === mio.ModalType.None) {
      for (let modalId in closedModal) {
        closedModal[modalId] = true;
      }
    }
  }),
};

/**
 * Begins a pending modal.
 * @return The modal identifier.
 */
function beginPendingModal(): number {
  let modalId = ++lastModalId;
  modalActions.setType(mio.ModalType.Pending);
  closedModal[modalId] = false;
  return modalId;
}

/**
 * Ends a pending modal.
 * @param modalId The modal identifier.
 */
function endPendingModal(modalId: number): void {
  if (!closedModal[modalId]) {
    modalActions.setType(mio.ModalType.None);
  }
}

/**
 * Wraps the reviser in a pending toggle and error handler.
 * @param name The name.
 * @param reviser The reviser.
 * @return The wrapped reviser.
 */
function wrapReviserAsync<T>(name: string, reviser: (state: mio.IApplicationState, modalId: number, revision: T) => PromiseLike<void>|void): (revision: T) => void {
  return mio.store.reviser(name, async function(state: mio.IApplicationState, revision: T): Promise<void> {
    let modalId = beginPendingModal();
    try {
      await reviser(state, modalId, revision);
      endPendingModal(modalId);
    } catch (error) {
      state.modal.error = mio.option(String(error.message));
      modalActions.setType(mio.ModalType.Error);
    } finally {
      delete closedModal[modalId];
    }
  });
}
