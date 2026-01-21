import React from 'react';
import { InputProps, SelectProps, CheckboxProps } from '../../types';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

const Label: React.FC<{ htmlFor?: string; children: React.ReactNode; className?: string }> = ({ htmlFor, children, className }) => (
  <label htmlFor={htmlFor} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 mb-2 block", className)}>
    {children}
  </label>
);

const ErrorMessage: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  return <p className="text-sm font-medium text-red-500 mt-1.5">{message}</p>;
};

export const Input: React.FC<InputProps> = ({ className, label, error, helperText, id, ...props }) => {
  const inputId = id || props.name;
  
  return (
    <div className="w-full">
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <input
        id={inputId}
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {helperText && !error && <p className="text-xs text-slate-500 mt-1.5">{helperText}</p>}
      <ErrorMessage message={error} />
    </div>
  );
};

export const Select: React.FC<SelectProps> = ({ className, label, error, options, id, ...props }) => {
  const selectId = id || props.name;

  return (
    <div className="w-full">
      {label && <Label htmlFor={selectId}>{label}</Label>}
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom arrow icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      <ErrorMessage message={error} />
    </div>
  );
};

export const Checkbox: React.FC<CheckboxProps> = ({ className, label, error, id, ...props }) => {
  const checkboxId = id || props.name || Math.random().toString(36);

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={checkboxId}
            className="peer h-4 w-4 shrink-0 rounded-sm border border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none checked:bg-primary-600 checked:border-primary-600 transition-all cursor-pointer"
            {...props}
          />
          <Check className="absolute left-0 top-0 h-4 w-4 hidden peer-checked:block text-white pointer-events-none" strokeWidth={3.5} />
        </div>
        <label
          htmlFor={checkboxId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 cursor-pointer select-none"
        >
          {label}
        </label>
      </div>
      <ErrorMessage message={error} />
    </div>
  );
};
