import React from 'react';

const ToolsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.75 3.75 0 00-5.303-5.303L6 11.42m5.42 3.75l-2.472 2.472a3.75 3.75 0 01-5.303-5.303L9 6.575m5.42 3.75l-2.472-2.472a3.75 3.75 0 000-5.303m7.072 7.072L18 11.42m-5.877 5.877l-1.844-1.844" />
  </svg>
);

export default ToolsIcon;