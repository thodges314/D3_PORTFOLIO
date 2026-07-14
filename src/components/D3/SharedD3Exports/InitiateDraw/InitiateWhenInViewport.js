/*
 * Logic to ensure target is visible before calling a function,
 * Such as triggering an animation for a D3 visualization
 * See here: https://medium.com/@ryanfinni/the-intersection-observer-api-practical-examples-7844dfa429e9
 */
export const InitiateWhenInViewport = (
  targetElement,
  callback,
  drawOnScrollStatus,
  threshold = 0.5
) => {
  const callbackFunction = callback;
  function handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting && drawOnScrollStatus.allowed) {
        callbackFunction();
        Object.defineProperty(drawOnScrollStatus, 'allowed', {
          value: false,
        });
      }
    });
  }
  const observer = new IntersectionObserver(handleIntersection, {
    threshold,
  });
  observer.observe(targetElement);
};
