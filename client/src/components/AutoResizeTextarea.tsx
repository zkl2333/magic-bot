import { useEffect, useRef, useState } from 'react'

type UseAutoResizeReturnType = [number, () => void, React.RefObject<HTMLTextAreaElement>]

const useAutoResize = (
  initialHeight: number,
  minHeight: number,
  maxHeight: number
): UseAutoResizeReturnType => {
  const [height, setHeight] = useState(initialHeight)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const updateHeight = () => {
    if (!textareaRef.current) return
    const element = textareaRef.current
    element.style.height = '0px'
    const newHeight = Math.max(minHeight, Math.min(element.scrollHeight, maxHeight))
    element.style.height = `${newHeight}px`
    setHeight(newHeight)
  }

  return [height, updateHeight, textareaRef]
}

interface AutoResizeTextareaProps {
  minHeight?: number
  maxHeight?: number
  value: string
  onChange: (value: string) => void
  onEnter?: () => void
}

const AutoResizeTextarea = (props: AutoResizeTextareaProps) => {
  const { minHeight = 40, maxHeight = 200, value, onChange } = props
  const [height, updateHeight, textareaRef] = useAutoResize(minHeight, minHeight, maxHeight)

  useEffect(() => {
    updateHeight()
  }, [value])

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value)
  }

  return (
    <textarea
      ref={textareaRef}
      className='textarea flex-1 textarea-bordered no-resize mr-2'
      style={{ height: `${height}px` }}
      value={value}
      onChange={handleChange}
      rows={1}
      onKeyDown={event => {
        if (event.key === 'Enter') {
          if (!event.ctrlKey) {
            event.preventDefault()
            props.onEnter?.()
          } else {
            props.onChange(value + '\n')
          }
        }
      }}
    />
  )
}

export default AutoResizeTextarea
