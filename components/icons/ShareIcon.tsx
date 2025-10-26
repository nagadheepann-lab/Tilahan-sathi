import React from 'react';

const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.195.025.39.042.586.05l1.455.131a2.25 2.25 0 100-2.414l-1.455-.131a2.25 2.25 0 00-.586.05z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 8.625c-.195-.025-.39-.042-.586-.05l-1.455-.131a2.25 2.25 0 100 2.414l1.455.131c.195.008.39.025.586.05a2.25 2.25 0 100-2.186z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
  </svg>
);

export default ShareIcon;