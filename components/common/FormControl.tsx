import React, { ReactNode } from 'react';

interface FormControlProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  className?: string;
}

const FormControl: React.FC<FormControlProps> = ({ label, htmlFor, children, className }) => {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      {children}
    </div>
  );
};

export default FormControl;