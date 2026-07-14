/*
 * Initiate callback to draw chart once scrolled to
 * or if resized after being scrolled to
 */
import { InitiateOnResize } from './InitiateOnResize';
import { InitiateWhenInViewport } from './InitiateWhenInViewport';

export const InitiateDraw = (target, callback) => {
  const drawOnScrollStatus = {
    allowed: true,
  };
  InitiateWhenInViewport(target, callback, drawOnScrollStatus);
  InitiateOnResize(target, callback, drawOnScrollStatus);
};
