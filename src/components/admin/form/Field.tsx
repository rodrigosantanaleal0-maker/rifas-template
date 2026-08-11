import type { ReactNode } from 'react';
import { cn } from '../../../lib/cn';

function FieldWrap({
  label,
  htmlFor,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-ink-muted">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}

interface BaseFieldProps {
  id: string;
  label: string;
  hint?: string;
  className?: string;
  required?: boolean;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  className,
  required,
}: BaseFieldProps & { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <FieldWrap label={label} htmlFor={id} hint={hint} className={className}>
      <input
        id={id}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
      />
    </FieldWrap>
  );
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  rows = 4,
  hint,
  className,
}: BaseFieldProps & { value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <FieldWrap label={label} htmlFor={id} hint={hint} className={className}>
      <textarea
        id={id}
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className={cn('input-field resize-y')}
      />
    </FieldWrap>
  );
}

export function CurrencyField({
  id,
  label,
  cents,
  onChange,
  hint,
  className,
}: BaseFieldProps & { cents: number; onChange: (cents: number) => void }) {
  return (
    <FieldWrap label={label} htmlFor={id} hint={hint} className={className}>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-faint">
          R$
        </span>
        <input
          id={id}
          type="number"
          min={0}
          step="0.01"
          value={(cents / 100).toFixed(2)}
          onChange={(e) => onChange(Math.round(Number(e.target.value || 0) * 100))}
          className="input-field pl-10"
        />
      </div>
    </FieldWrap>
  );
}

export function NumberField({
  id,
  label,
  value,
  onChange,
  min,
  hint,
  className,
}: BaseFieldProps & { value: number; onChange: (value: number) => void; min?: number }) {
  return (
    <FieldWrap label={label} htmlFor={id} hint={hint} className={className}>
      <input
        id={id}
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(Number(e.target.value || 0))}
        className="input-field"
      />
    </FieldWrap>
  );
}

export function DateField({
  id,
  label,
  valueISO,
  onChange,
  hint,
  className,
}: BaseFieldProps & { valueISO: string; onChange: (iso: string) => void }) {
  const localValue = valueISO ? new Date(valueISO).toISOString().slice(0, 16) : '';
  return (
    <FieldWrap label={label} htmlFor={id} hint={hint} className={className}>
      <input
        id={id}
        type="datetime-local"
        value={localValue}
        onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : '')}
        className="input-field"
      />
    </FieldWrap>
  );
}
