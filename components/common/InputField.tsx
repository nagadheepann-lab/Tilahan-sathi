import React from 'react';

// FIX: Switched to a discriminated union for props to correctly type the polymorphic component.
// This ensures that props for 'input', 'select', and 'textarea' are validated correctly
// based on the 'as' prop, resolving the error with the 'rows' attribute on textareas.
type InputFieldAsInputProps = {
  as?: 'input';
} & React.InputHTMLAttributes<HTMLInputElement>;

type InputFieldAsSelectProps = {
  as: 'select';
} & React.SelectHTMLAttributes<HTMLSelectElement>;

type InputFieldAsTextareaProps = {
  as: 'textarea';
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

type InputFieldProps = InputFieldAsInputProps | InputFieldAsSelectProps | InputFieldAsTextareaProps;

const InputField: React.FC<InputFieldProps> = (props) => {
  const baseClasses = "mt-1 block w-full rounded-md border-white/20 bg-black/30 text-white shadow-sm focus:border-brand-yellow focus:ring-brand-yellow sm:text-sm p-2 placeholder-gray-400";
  const combinedClasses = `${baseClasses} ${props.className || ''}`;

  switch (props.as) {
    case 'select': {
      const { as, className, children, ...rest } = props;
      return (
        <select className={combinedClasses} {...rest}>
          {children}
        </select>
      );
    }
    case 'textarea': {
      const { as, className, ...rest } = props;
      return <textarea className={combinedClasses} {...rest} />;
    }
    default: { // 'input' or undefined
      const { as, className, ...rest } = props;
      return <input className={combinedClasses} {...rest} />;
    }
  }
};

export default InputField;