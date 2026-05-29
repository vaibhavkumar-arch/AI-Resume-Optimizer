import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-4 py-3 rounded-lg bg-surface/50 border ${
          error ? 'border-danger focus:ring-danger' : 'border-white/10 focus:border-primary focus:ring-primary'
        } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors text-white placeholder-gray-500 ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
