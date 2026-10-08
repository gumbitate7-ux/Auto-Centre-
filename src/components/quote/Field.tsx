import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { Icon } from '../ui/Icon'

interface FieldShellProps {
  id: string
  label: string
  required?: boolean
  optional?: boolean
  error?: string
  hint?: ReactNode
  children: ReactNode
  className?: string
}

export const describedBy = (id: string, error?: string, hint?: ReactNode) =>
  [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined

export function FieldShell({ id, label, required, optional, error, hint, children, className = '' }: FieldShellProps) {
  return (
    <div className={`field${error ? ' has-error' : ''} ${className}`}>
      <label htmlFor={id} className="field__label">
        {label}
        {required && (
          <span className="field__req" aria-hidden="true">
            *
          </span>
        )}
        {optional && <span className="field__opt">Optional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field__error">
          <Icon name="alert" size={16} />
          {error}
        </p>
      )}
    </div>
  )
}

type TextFieldProps = Omit<FieldShellProps, 'children'> & InputHTMLAttributes<HTMLInputElement>

export function TextField({ id, label, required, optional, error, hint, className, ...input }: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} required={required} optional={optional} error={error} hint={hint} className={className}>
      <input
        id={id}
        className="field__input"
        aria-invalid={Boolean(error)}
        aria-required={required || undefined}
        aria-describedby={describedBy(id, error, hint)}
        {...input}
      />
    </FieldShell>
  )
}

type TextAreaProps = Omit<FieldShellProps, 'children'> & TextareaHTMLAttributes<HTMLTextAreaElement>

export function TextArea({ id, label, required, optional, error, hint, className, ...textarea }: TextAreaProps) {
  return (
    <FieldShell id={id} label={label} required={required} optional={optional} error={error} hint={hint} className={className}>
      <textarea
        id={id}
        className="field__input field__textarea"
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error, hint)}
        {...textarea}
      />
    </FieldShell>
  )
}
