import { useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode, type Ref } from 'react'
import { useMagnetic } from '../../hooks/useMagnetic'
import { Icon, type IconName } from './Icon'
import './Button.css'

type Variant = 'primary' | 'secondary' | 'light' | 'outline-light' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface CommonProps {
  variant?: Variant
  size?: Size
  icon?: IconName
  iconStart?: IconName
  magnetic?: boolean
  block?: boolean
  children: ReactNode
  className?: string
}

type ButtonAsLink = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

export type ButtonProps = ButtonAsLink | ButtonAsButton

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    icon,
    iconStart,
    magnetic = false,
    block = false,
    children,
    className = '',
    ...rest
  } = props
  const ref = useRef<HTMLElement | null>(null)
  useMagnetic(ref, magnetic)

  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    block ? 'btn--block' : '',
    magnetic ? 'btn--magnetic' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <span className="btn__inner">
      {iconStart && <Icon name={iconStart} size={18} className="btn__icon-start" />}
      <span className="btn__label">{children}</span>
      {icon && <Icon name={icon} size={18} className="btn__icon" />}
    </span>
  )

  if ('href' in rest && rest.href !== undefined) {
    const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>
    return (
      <a ref={ref as Ref<HTMLAnchorElement>} className={classes} {...anchorProps}>
        {content}
      </a>
    )
  }
  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button ref={ref as Ref<HTMLButtonElement>} className={classes} type={buttonProps.type ?? 'button'} {...buttonProps}>
      {content}
    </button>
  )
}
