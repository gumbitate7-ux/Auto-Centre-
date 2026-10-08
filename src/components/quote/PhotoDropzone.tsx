import { useEffect, useMemo, useState, type ChangeEvent, type DragEvent } from 'react'
import { Icon } from '../ui/Icon'
import { MAX_PHOTOS, MAX_PHOTO_MB } from './quoteModel'

interface PhotoDropzoneProps {
  id: string
  files: File[]
  onChange: (files: File[]) => void
}

const isImage = (file: File) => file.type.startsWith('image/') || /\.(heic|heif)$/i.test(file.name)

export function PhotoDropzone({ id, files, onChange }: PhotoDropzoneProps) {
  const [dragging, setDragging] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const previews = useMemo(() => files.map((file) => ({ file, url: URL.createObjectURL(file) })), [files])
  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews])

  const addFiles = (incoming: FileList | null) => {
    if (!incoming?.length) return
    const accepted: File[] = []
    let rejectedType = 0
    let rejectedSize = 0
    Array.from(incoming).forEach((file) => {
      if (!isImage(file)) rejectedType++
      else if (file.size > MAX_PHOTO_MB * 1024 * 1024) rejectedSize++
      else if (!files.some((f) => f.name === file.name && f.size === file.size)) accepted.push(file)
    })
    const room = MAX_PHOTOS - files.length
    const overflow = Math.max(0, accepted.length - room)
    onChange([...files, ...accepted.slice(0, room)])

    const messages: string[] = []
    if (rejectedType) messages.push(`${rejectedType} file${rejectedType > 1 ? 's were' : ' was'} not an image`)
    if (rejectedSize) messages.push(`${rejectedSize} file${rejectedSize > 1 ? 's were' : ' was'} larger than ${MAX_PHOTO_MB} MB`)
    if (overflow) messages.push(`only ${MAX_PHOTOS} photos can be attached`)
    setNotice(messages.length ? `Some photos were skipped: ${messages.join(', ')}.` : null)
  }

  const onInput = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(event.target.files)
    event.target.value = ''
  }

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDragging(false)
    addFiles(event.dataTransfer.files)
  }

  const remove = (index: number) => {
    onChange(files.filter((_, i) => i !== index))
    setNotice(null)
  }

  const full = files.length >= MAX_PHOTOS

  return (
    <div className="dropzone-field">
      <input
        id={id}
        type="file"
        accept="image/*,.heic,.heif"
        multiple
        className="visually-hidden"
        onChange={onInput}
        disabled={full}
        aria-describedby={`${id}-hint${notice ? ` ${id}-notice` : ''}`}
      />
      <label
        htmlFor={id}
        className={`dropzone${dragging ? ' is-dragging' : ''}${full ? ' is-full' : ''}`}
        onDragEnter={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false)
        }}
        onDrop={onDrop}
      >
        <span className="dropzone__icon" aria-hidden="true">
          <Icon name="upload" size={22} />
        </span>
        <span className="dropzone__title">
          {full ? 'Photo limit reached' : (
            <>
              Drag photos here or <span className="dropzone__browse">browse</span>
            </>
          )}
        </span>
        <span id={`${id}-hint`} className="dropzone__hint">
          Up to {MAX_PHOTOS} photos · JPG, PNG or HEIC · {MAX_PHOTO_MB} MB each
        </span>
      </label>

      {notice && (
        <p id={`${id}-notice`} className="field__error" role="status">
          <Icon name="alert" size={16} />
          {notice}
        </p>
      )}

      {previews.length > 0 && (
        <ul className="dropzone__previews" aria-label="Attached photos">
          {previews.map((p, i) => (
            <li key={p.url} className="dropzone__thumb">
              <img src={p.url} alt={`Attached photo: ${p.file.name}`} />
              <button type="button" className="dropzone__remove" onClick={() => remove(i)} aria-label={`Remove ${p.file.name}`}>
                <Icon name="close" size={14} strokeWidth={2} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
