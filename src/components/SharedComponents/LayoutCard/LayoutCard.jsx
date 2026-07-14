import React, { useEffect, useRef } from 'react';
import './LayoutCard.scss';
import Card from '@material-ui/core/Card';

// size options : {"small", "medium", "large"}
export const LayoutCard = ({ size, height, children, responsive = false }) => {
  let Classes = 'col-small';

  if (size === 'small') Classes = 'col-small';
  else if (size === 'medium') Classes = 'col-medium';
  else if (size === 'large') Classes = 'col-large';
  else if (size === 'small2') Classes = 'col-small2';
  else if (size === 'medium2') Classes = 'col-medium2';
  if (height === 'unset') Classes += ' height-unset';

  const ref = useRef();

  // checking for object resizing and if responsive is true giving a height until data loads
  useEffect(() => {
    if (!ref.current) return;
    const resizeObserver = new ResizeObserver(() => {
      if (responsive)
        if (ref.current.children[0].clientHeight > 0)
          ref.current.style.height = 'unset';
        else ref.current.style.height = '200px';
    });
    resizeObserver.observe(ref.current);
    // eslint-disable-next-line consistent-return
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className={Classes} style={{ height: `${height}` }}>
      <Card ref={ref} className="card-element" elevation={3}>
        {children}
      </Card>
    </div>
  );
};
