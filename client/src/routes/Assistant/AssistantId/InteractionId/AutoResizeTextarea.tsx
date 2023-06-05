import TextareaAutosize from '@mui/base/TextareaAutosize'
import SendIcon from './SendIcon'
import { useRef } from 'react'

interface AutoResizeTextareaProps {
  maxRows?: number
  minRows?: number
  value: string
  loading: boolean
  onChange: (value: string) => void
  onSubmit?: () => void
}

const AutoResizeTextarea = (props: AutoResizeTextareaProps) => {
  const { value, onChange } = props

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value)
  }

  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (!event.ctrlKey) {
        props.onSubmit?.()
      } else if (inputRef.current) {
        const { selectionStart, selectionEnd } = inputRef.current
        const newValue = props.value.slice(0, selectionStart) + '\n' + props.value.slice(selectionEnd)
        props.onChange(newValue)
        inputRef.current.selectionStart = inputRef.current.selectionEnd = selectionStart + 1
      }
    }
  }

  return (
    <div className='flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-base-300 bg-base-100 rounded-md shadow'>
      <TextareaAutosize
        ref={inputRef}
        value={value}
        placeholder='Enter 发送，Ctrl + Enter 换行'
        className='m-0 outline-none w-full resize-none border-0 bg-transparent p-0 pr-9 focus:ring-0 focus-visible:ring-0 pl-2 md:pl-0 overflow-y-auto'
        onChange={handleChange}
        maxRows={props.maxRows}
        minRows={props.minRows}
        onKeyDown={handleKeyDown}
      />
      <div className='absolute right-1 bottom-0 top-0 flex items-center'>
        {props.loading ? (
          <div className='loading loading-ring loading-xs mr-2' />
        ) : (
          <button
            className='p-1 rounded-md text-base-content disabled:opacity-40'
            disabled={value.length === 0}
            onClick={() => props.onSubmit?.()}
          >
            <SendIcon />
          </button>
        )}
      </div>
    </div>
  )
}

export default AutoResizeTextarea
