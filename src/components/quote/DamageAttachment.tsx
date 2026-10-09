import { describeItem, formatRand, pricing } from '../../data/damage'
import { scrollToSection } from '../../lib/scroll'
import { Icon } from '../ui/Icon'
import type { DamageReport } from './QuoteContext'

interface DamageAttachmentProps {
  report: DamageReport
  full?: boolean
  onRemove: () => void
}

export const estimateText = (report: DamageReport) =>
  report.estimate && report.estimate.high > 0
    ? `${formatRand(report.estimate.low)} – ${formatRand(report.estimate.high)}`
    : null

/** Shows the damage map handed over from the estimator inside the quote form. */
export function DamageAttachment({ report, full = false, onRemove }: DamageAttachmentProps) {
  const range = pricing.showPrices ? estimateText(report) : null
  const count = report.items.length

  return (
    <div className={`damage-attach${full ? ' damage-attach--full' : ''}`}>
      <div className="damage-attach__head">
        <span className="damage-attach__icon" aria-hidden="true">
          <Icon name="pin" size={16} />
        </span>
        <p className="damage-attach__title">
          Damage map attached
          <span>
            {count} area{count === 1 ? '' : 's'}
            {range ? ` · est. ${range}` : ''}
          </span>
        </p>
        <button type="button" className="damage-attach__link" onClick={() => scrollToSection('estimate')}>
          Edit
        </button>
        <button type="button" className="damage-attach__remove" onClick={onRemove} aria-label="Remove damage map">
          <Icon name="close" size={14} />
        </button>
      </div>
      {full && (
        <ol className="damage-attach__list">
          {report.items.map((item, i) => (
            <li key={item.panel}>
              <span className="tabular">{i + 1}</span>
              {describeItem(item)}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
