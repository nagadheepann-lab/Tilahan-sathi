import React from 'react';

const BugIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25c-2.485 0-4.5 2.015-4.5 4.5s2.015 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.015-4.5-4.5-4.5zm0 0V6.75m0 1.5V1.5m0 16.5v2.25m-6.364-10.864L3.39 3.39m17.22 17.22l-2.244-2.244m2.244-12.732L18.61 3.39M3.39 18.61l2.244-2.244M1.5 12h1.5m18 0h-1.5" />
  </svg>
);

export default BugIcon;