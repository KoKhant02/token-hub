interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  accentColor?: 'cyan' | 'purple' | 'green' | 'orange';
  disabled?: boolean;
  min?: string;
  maxLength?: number;
  helperText?: string;
}

export function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  accentColor = 'cyan',
  disabled = false,
  min,
  maxLength,
  helperText,
}: FormInputProps) {
  const accentColors = {
    cyan: 'focus:border-cyan-500',
    purple: 'focus:border-purple-500',
    green: 'focus:border-green-500',
    orange: 'focus:border-orange-500',
  };

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        maxLength={maxLength}
        className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none ${accentColors[accentColor]} transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
      />
      {helperText && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}
