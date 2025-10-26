import React from 'react';

const StoreIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A.75.75 0 0114.25 12h.008a.75.75 0 01.75.75V21m-4.5 0v-7.5A.75.75 0 009.75 12h.008a.75.75 0 00.75.75V21m-4.5 0V15A2.25 2.25 0 016.75 12.75h10.5A2.25 2.25 0 0119.5 15v6m-15 0h15M4.5 12V6a2.25 2.25 0 012.25-2.25h10.5A2.25 2.25 0 0121.75 6v6m-19.5 0h19.5" />
  </svg>
);

export default StoreIcon;
