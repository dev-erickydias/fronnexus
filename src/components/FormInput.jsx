// components/FormInput.jsx
'use client';

import React, { useId, useState } from 'react';

/**
 * Componente de input reutilizável
 * - Controlado: passe value e onChange
 * - Não-controlado: omita value/onChange e o componente usa estado interno
 * - Ícone opcional à esquerda (ReactNode)
 */
export default function FormInput({
  label,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  defaultValue = '',
  icon, // ex.: <HiOutlineMail className="w-5 h-5" />
  required = false,
  disabled = false,
  helperText, // texto auxiliar
  errorText, // mensagem de erro (muda o estilo)
  className = '',
  inputClassName = '',
  ...props
}) {
  const autoId = useId();
  const inputId = name || autoId;

  // estado interno apenas se o componente não for controlado
  const [innerValue, setInnerValue] = useState(defaultValue);

  const isControlled = value !== undefined;

  const handleChange = (e) => {
    if (isControlled) {
      onChange?.(e);
    } else {
      setInnerValue(e.target.value);
      onChange?.(e); // permite escutar mesmo no modo interno
    }
  };

  const showError = Boolean(errorText);
  const baseBorder = showError
    ? 'border-red-500 focus:border-red-600 focus:ring-red-600'
    : 'border-gray-300 focus:border-black focus:ring-black';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </span>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          value={isControlled ? value : innerValue}
          onChange={handleChange}
          className={`block w-full rounded-md border ${baseBorder} shadow-sm sm:text-sm py-2 px-3 ${
            icon ? 'pl-10' : ''
          } disabled:bg-gray-100 disabled:cursor-not-allowed ${inputClassName}`}
          {...props}
        />
      </div>

      {(helperText || errorText) && (
        <p
          className={`mt-1 text-xs ${
            showError ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          {showError ? errorText : helperText}
        </p>
      )}
    </div>
  );
}
