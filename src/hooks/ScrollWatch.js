/**
 * Adapted from https://stackoverflow.com/questions/62497110/detect-scroll-direction-in-react-js
 * Declare a state in a component such as  const [scrollDir, setScrollDir] = useState('');
 * Then call scroll watch to have those states update when user scrolls up or down
 * ScrollWatch(scrollDir, setScrollDir);
 */
import { useEffect } from 'react';

export const ScrollWatch = (scrollDir, setScrollDir) => {
  useEffect(() => {
    const threshold = 10;
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }
      setScrollDir(scrollY > lastScrollY ? 'scrolling-down' : 'scrolling-up');
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollDir]);
};
