import React from 'react';

const DropIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c-4.437-4.162-7.5-10.36-7.5-12.75 0-2.348 1.902-4.25 4.25-4.25h6.5c2.348 0 4.25 1.902 4.25 4.25 0 2.39-3.063 8.588-7.5 12.75z" />
  </svg>
);

export default DropIcon;