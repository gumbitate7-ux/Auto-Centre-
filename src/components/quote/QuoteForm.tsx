import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { business, whatsappHref } from '../../data/business'
import { describeItem, pricing } from '../../data/damage'
import { scrollToSection } from '../../lib/scroll'
import { isDemoMode, submitQuote } from '../../lib/submitQuote'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { TextArea, TextField, describedBy } from './Field'
import { PhotoDropzone } from './PhotoDropzone'
import { DamageAttachment, estimateText } from './DamageAttachment'
import { useQuote } from './QuoteContext'
import {
  initialValues,
  MESSAGE_MAX,
  repairLabel,
  repairOptions,
  steps,
  validateField,
  validateStep,
  type ContactMethod,
  type QuoteErrors,
  type QuoteValues,
} from './quoteModel'
import './QuoteForm.css'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const contactOptions: { value: ContactMethod; label: string }[] = [
  { value: 'call', label: 'Phone call' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
]

export function QuoteForm() {
  const { preset, damage, detachDamage } = useQuote()
  const [values, setValues] = useState<QuoteValues>(initialValues)
  const [errors, setErrors] = useState<QuoteErrors>({})
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [status, setStatus] = useState<Status>('idle')
  const [reference, setReference] = useState('')
  const [presetNote, setPresetNote] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const legendRef = useRef<HTMLHeadingElement>(null)
  const shouldFocusStep = useRef(false)

  // A service card or project asked for this repair type.
  useEffect(() => {
    if (!preset) return
    if (status === 'success') {
      // A new request after a sent one starts clean rather than reusing the last photos and details.
      setValues({ ...initialValues, repairType: preset.service })
      setErrors({})
      setStatus('idle')
      setStep(0)
    } else {
      setValues((v) => ({ ...v, repairType: preset.service }))
      setErrors((e) => ({ ...e, repairType: undefined }))
    }
    setPresetNote(repairLabel(preset.service))
    // Only react to new presets, not to status changes.
  }, [preset])

  // Move focus to the new step heading so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (!shouldFocusStep.current) return
    shouldFocusStep.current = false
    legendRef.current?.focus({ preventScroll: true })
    const top = cardRef.current?.getBoundingClientRect().top ?? 0
    if (top < 60) cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [step, status])

  const set = <K extends keyof QuoteValues>(field: K, value: QuoteValues[K]) => {
    const next = { ...values, [field]: value }
    setValues(next)
    // Re-validate live only once a field has shown an error.
    if (errors[field]) setErrors((e) => ({ ...e, [field]: validateField(field, next) }))
    if (field === 'contactMethod' && errors.email) setErrors((e) => ({ ...e, email: validateField('email', next) }))
  }

  const blur = (field: keyof QuoteValues) => {
    const value = values[field]
    if (typeof value === 'string' && value === '' && !errors[field]) return
    setErrors((e) => ({ ...e, [field]: validateField(field, values) }))
  }

  const focusFirstError = (errs: QuoteErrors) => {
    const first = steps.flatMap((s) => s.fields).find((f) => errs[f])
    if (!first) return
    const el = document.getElementById(`quote-${first}`) ?? document.querySelector<HTMLElement>(`[name="${first}"]`)
    el?.focus()
  }

  const goTo = (index: number) => {
    setDirection(index > step ? 1 : -1)
    shouldFocusStep.current = true
    setStep(index)
  }

  const next = () => {
    const errs = validateStep(step, values)
    setErrors((e) => ({
      ...e,
      ...errs,
      ...Object.fromEntries(steps[step].fields.filter((f) => !errs[f]).map((f) => [f, undefined])),
    }))
    if (Object.keys(errs).length) {
      focusFirstError(errs)
      return
    }
    goTo(step + 1)
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (status === 'submitting') return
    if (step < steps.length - 1) {
      next()
      return
    }
    // Final check across every step.
    for (let i = 0; i < steps.length; i++) {
      const errs = validateStep(i, values)
      if (Object.keys(errs).length) {
        setErrors((e) => ({ ...e, ...errs }))
        if (i !== step) goTo(i)
        else focusFirstError(errs)
        return
      }
    }
    setStatus('submitting')
    try {
      const result = await submitQuote(values, damage)
      setReference(result.reference)
      // The map went with this request; the estimator can start a new one.
      detachDamage()
      shouldFocusStep.current = true
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const reset = () => {
    detachDamage()
    setValues(initialValues)
    setErrors({})
    setPresetNote(null)
    setStatus('idle')
    shouldFocusStep.current = true
    setStep(0)
  }

  const firstName = values.name.trim().split(/\s+/)[0]

  return (
    <div ref={cardRef} className="quote-card">
      {status === 'success' ? (
        <div className="quote-success" role="status">
          <span className="quote-success__badge" aria-hidden="true">
            <svg viewBox="0 0 52 52" width="52" height="52">
              <circle cx="26" cy="26" r="24" />
              <path d="m15.5 27 7 7 14-15" />
            </svg>
          </span>
          <h3 ref={legendRef} tabIndex={-1} className="quote-success__title">
            Thanks{firstName ? `, ${firstName}` : ''}. Your request is in.
          </h3>
          <p className="quote-success__text">
            Dino&rsquo;s will review your details and contact you by{' '}
            {values.contactMethod === 'email' ? 'email' : values.contactMethod === 'whatsapp' ? 'WhatsApp' : 'phone'} to
            discuss your repair and arrange an assessment.
          </p>
          <dl className="quote-success__ref">
            <dt>Reference</dt>
            <dd className="tabular">{reference}</dd>
          </dl>
          <div className="quote-success__actions">
            <Button
              href={whatsappHref(`Hi Dino's, I've just sent quote request ${reference}. Here are some extra photos.`)}
              target="_blank"
              rel="noopener noreferrer"
              iconStart="whatsapp"
            >
              Send more photos on WhatsApp
            </Button>
            <Button variant="secondary" onClick={reset}>
              Start a new request
            </Button>
          </div>
          {isDemoMode && (
            <p className="quote-demo-note">
              <Icon name="alert" size={15} />
              Demo mode: no request was sent. Connect a form endpoint (VITE_QUOTE_ENDPOINT) to receive requests.
            </p>
          )}
        </div>
      ) : (
        <form className="quote-form" onSubmit={onSubmit} noValidate aria-describedby="quote-required-note">
          <div className="quote-form__head">
            <ol className="quote-steps" aria-label="Form progress">
              {steps.map((s, i) => {
                const state = i < step ? 'done' : i === step ? 'current' : 'todo'
                return (
                  <li
                    key={s.id}
                    className={`quote-steps__item is-${state}`}
                    aria-current={i === step ? 'step' : undefined}
                  >
                    <button
                      type="button"
                      className="quote-steps__btn"
                      onClick={() => goTo(i)}
                      disabled={i >= step}
                      aria-label={`Step ${i + 1}: ${s.title}${state === 'done' ? ' (completed, edit)' : ''}`}
                    >
                      <span className="quote-steps__num tabular" aria-hidden="true">
                        {state === 'done' ? <Icon name="check" size={13} strokeWidth={2.4} /> : i + 1}
                      </span>
                      <span className="quote-steps__label">{s.title}</span>
                    </button>
                  </li>
                )
              })}
            </ol>
            <div className="quote-progress" aria-hidden="true">
              <span style={{ transform: `scaleX(${(step + 1) / steps.length})` }} />
            </div>
          </div>

          {damage && step < 2 && <DamageAttachment report={damage} onRemove={detachDamage} />}

          {presetNote && !damage && step < 2 && (
            <p className="quote-preset">
              <Icon name="check" size={15} strokeWidth={2} />
              Repair type selected: <strong>{presetNote}</strong>
              <button type="button" onClick={() => setPresetNote(null)} aria-label="Dismiss">
                <Icon name="close" size={14} />
              </button>
            </p>
          )}

          <div key={step} className={`quote-step quote-step--${direction > 0 ? 'fwd' : 'back'}`}>
            <h3 ref={legendRef} tabIndex={-1} className="quote-step__title">
              <span className="quote-step__count tabular">
                Step {step + 1} of {steps.length}
              </span>
              {steps[step].title}
            </h3>

            {step === 0 && (
              <div className="quote-grid">
                <TextField
                  id="quote-name"
                  name="name"
                  label="Full name"
                  required
                  autoComplete="name"
                  value={values.name}
                  error={errors.name}
                  onChange={(e) => set('name', e.target.value)}
                  onBlur={() => blur('name')}
                  className="quote-grid__full"
                />
                <TextField
                  id="quote-phone"
                  name="phone"
                  label="Phone number"
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="e.g. 082 123 4567"
                  value={values.phone}
                  error={errors.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  onBlur={() => blur('phone')}
                />
                <TextField
                  id="quote-email"
                  name="email"
                  label="Email"
                  optional={values.contactMethod !== 'email'}
                  required={values.contactMethod === 'email'}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={values.email}
                  error={errors.email}
                  onChange={(e) => set('email', e.target.value)}
                  onBlur={() => blur('email')}
                />
                <fieldset className="quote-grid__full choice-group">
                  <legend className="field__label">How should we contact you?</legend>
                  <div className="segmented">
                    {contactOptions.map((o) => (
                      <label key={o.value} className="segmented__option">
                        <input
                          type="radio"
                          name="contactMethod"
                          value={o.value}
                          checked={values.contactMethod === o.value}
                          onChange={() => set('contactMethod', o.value)}
                        />
                        <span>{o.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}

            {step === 1 && (
              <div className="quote-grid">
                <TextField
                  id="quote-make"
                  name="make"
                  label="Vehicle make"
                  required
                  placeholder="e.g. Volkswagen"
                  autoComplete="off"
                  value={values.make}
                  error={errors.make}
                  onChange={(e) => set('make', e.target.value)}
                  onBlur={() => blur('make')}
                />
                <TextField
                  id="quote-model"
                  name="model"
                  label="Vehicle model"
                  required
                  placeholder="e.g. Polo"
                  autoComplete="off"
                  value={values.model}
                  error={errors.model}
                  onChange={(e) => set('model', e.target.value)}
                  onBlur={() => blur('model')}
                />
                <TextField
                  id="quote-year"
                  name="year"
                  label="Year"
                  optional
                  inputMode="numeric"
                  placeholder="e.g. 2019"
                  value={values.year}
                  error={errors.year}
                  onChange={(e) => set('year', e.target.value.replace(/\D/g, '').slice(0, 4))}
                  onBlur={() => blur('year')}
                />
              </div>
            )}

            {step === 2 && (
              <div className="quote-grid">
                {damage && (
                  <div className="quote-grid__full">
                    <DamageAttachment report={damage} full onRemove={detachDamage} />
                  </div>
                )}
                <fieldset
                  className="quote-grid__full choice-group"
                  aria-describedby={describedBy('quote-repairType', errors.repairType)}
                  aria-invalid={Boolean(errors.repairType)}
                >
                  <legend className="field__label">
                    Repair type
                    <span className="field__req" aria-hidden="true">
                      *
                    </span>
                  </legend>
                  <div className={`repair-options${errors.repairType ? ' has-error' : ''}`}>
                    {repairOptions.map((o, i) => (
                      <label key={o.value} className="repair-option">
                        <input
                          id={i === 0 ? 'quote-repairType' : undefined}
                          type="radio"
                          name="repairType"
                          value={o.value}
                          checked={values.repairType === o.value}
                          onChange={() => set('repairType', o.value)}
                        />
                        <span className="repair-option__box">
                          <span className="repair-option__check" aria-hidden="true">
                            <Icon name="check" size={12} strokeWidth={2.6} />
                          </span>
                          {o.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.repairType && (
                    <p id="quote-repairType-error" className="field__error">
                      <Icon name="alert" size={16} />
                      {errors.repairType}
                    </p>
                  )}
                </fieldset>

                <TextArea
                  id="quote-message"
                  name="message"
                  label="Describe the damage"
                  optional
                  rows={4}
                  maxLength={MESSAGE_MAX}
                  placeholder="Where is the damage, and how did it happen? Anything else we should know?"
                  value={values.message}
                  error={errors.message}
                  hint={`${values.message.length} / ${MESSAGE_MAX}`}
                  onChange={(e) => set('message', e.target.value)}
                  className="quote-grid__full"
                />

                <div className="quote-grid__full field">
                  <p className="field__label" id="quote-photos-label">
                    Photos of the damage <span className="field__opt">Optional, but recommended</span>
                  </p>
                  <PhotoDropzone id="quote-photos" files={values.photos} onChange={(files) => set('photos', files)} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="quote-review">
                <ReviewGroup title="Your details" onEdit={() => goTo(0)}>
                  <ReviewRow label="Name" value={values.name} />
                  <ReviewRow label="Phone" value={values.phone} />
                  <ReviewRow label="Email" value={values.email || '—'} />
                  <ReviewRow
                    label="Contact by"
                    value={contactOptions.find((o) => o.value === values.contactMethod)?.label ?? ''}
                  />
                </ReviewGroup>
                <ReviewGroup title="Vehicle" onEdit={() => goTo(1)}>
                  <ReviewRow label="Vehicle" value={`${values.make} ${values.model}`.trim()} />
                  <ReviewRow label="Year" value={values.year || '—'} />
                </ReviewGroup>
                <ReviewGroup title="Damage" onEdit={() => goTo(2)}>
                  <ReviewRow label="Repair type" value={repairLabel(values.repairType)} />
                  <ReviewRow label="Description" value={values.message || '—'} />
                  <ReviewRow
                    label="Photos"
                    value={values.photos.length ? `${values.photos.length} attached` : 'None attached'}
                  />
                </ReviewGroup>
                {damage && (
                  <ReviewGroup title="Damage map" onEdit={() => scrollToSection('estimate')}>
                    {damage.items.map((item, i) => (
                      <ReviewRow key={item.panel} label={`Area ${i + 1}`} value={describeItem(item)} />
                    ))}
                    {pricing.showPrices && estimateText(damage) && (
                      <ReviewRow label="Indicative estimate" value={estimateText(damage)!} />
                    )}
                  </ReviewGroup>
                )}

                <label className={`consent${errors.consent ? ' has-error' : ''}`}>
                  <input
                    id="quote-consent"
                    type="checkbox"
                    name="consent"
                    checked={values.consent}
                    onChange={(e) => set('consent', e.target.checked)}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? 'quote-consent-error' : undefined}
                  />
                  <span className="consent__box" aria-hidden="true">
                    <Icon name="check" size={13} strokeWidth={2.6} />
                  </span>
                  <span>I agree to be contacted by {business.name} about this quote request.</span>
                </label>
                {errors.consent && (
                  <p id="quote-consent-error" className="field__error">
                    <Icon name="alert" size={16} />
                    {errors.consent}
                  </p>
                )}
              </div>
            )}
          </div>

          {status === 'error' && (
            <div className="quote-alert" role="alert">
              <Icon name="alert" size={20} />
              <div>
                <p className="quote-alert__title">Your request couldn&rsquo;t be sent.</p>
                <p>
                  Please check your connection and try again, or contact us directly on{' '}
                  <a href={business.phone.href}>{business.phone.display}</a> or{' '}
                  <a href={whatsappHref()} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                  .
                </p>
              </div>
            </div>
          )}

          <div className="quote-actions">
            {step > 0 ? (
              <Button
                variant="ghost"
                iconStart="arrow-left"
                onClick={() => goTo(step - 1)}
                disabled={status === 'submitting'}
              >
                Back
              </Button>
            ) : (
              <p id="quote-required-note" className="quote-actions__note">
                <span aria-hidden="true">*</span> Required
              </p>
            )}
            <Button
              type="submit"
              size="lg"
              icon={status === 'submitting' ? undefined : step === steps.length - 1 ? 'arrow-up-right' : 'arrow-right'}
              aria-busy={status === 'submitting'}
              className={status === 'submitting' ? 'is-loading' : ''}
            >
              {status === 'submitting' ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Sending request…
                </>
              ) : step === steps.length - 1 ? (
                status === 'error' ? (
                  'Try again'
                ) : (
                  'Submit Request'
                )
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

function ReviewGroup({ title, onEdit, children }: { title: string; onEdit: () => void; children: ReactNode }) {
  return (
    <section className="review-group" aria-label={title}>
      <div className="review-group__head">
        <h4>{title}</h4>
        <button type="button" onClick={onEdit} className="review-group__edit">
          Edit<span className="visually-hidden"> {title.toLowerCase()}</span>
        </button>
      </div>
      <dl>{children}</dl>
    </section>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="review-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}
