import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement HTMLDialogElement's imperative API yet (showModal/
// close) — this repo's <dialog>-based modals (VerifyTitleDialog,
// LocationPicker) both call it. Minimal polyfill, only patching what's
// actually missing, so a future jsdom upgrade that adds real support makes
// this silently inert rather than needing to be torn out.
if (typeof HTMLDialogElement !== "undefined") {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
      const wasOpen = this.hasAttribute("open");
      this.removeAttribute("open");
      if (wasOpen) this.dispatchEvent(new Event("close"));
    };
  }
}
