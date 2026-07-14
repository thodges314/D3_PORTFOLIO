/*
 * This util calls a callback method when an element's parent
 *  is resized and drawOnScrollStatus.allowed is false
 */

export const InitiateOnResize = (
  targetElement,
  callback,
  drawOnScrollStatus
) => {
  const callbackFunction = callback;
  const observer = new ResizeObserver(() => {
    if (drawOnScrollStatus.allowed === false) {
      callbackFunction();
    }
  });

  observer.observe(targetElement.parentElement);
};
