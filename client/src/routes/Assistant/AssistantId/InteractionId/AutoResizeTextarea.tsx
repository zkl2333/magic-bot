import TextareaAutosize from '@mui/base/TextareaAutosize'
import SendIcon from './SendIcon'

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

  return (
    <div className='flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-base-300 bg-base-100 rounded-md shadow'>
      <TextareaAutosize
        value={value}
        placeholder='Enter 发送，Ctrl + Enter 换行'
        className='m-0 outline-none w-full resize-none border-0 bg-transparent p-0 pr-9 focus:ring-0 focus-visible:ring-0 pl-2 md:pl-0 overflow-y-auto'
        onChange={handleChange}
        maxRows={props.maxRows}
        minRows={props.minRows}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            if (!event.ctrlKey) {
              event.preventDefault()
              props.onSubmit?.()
            } else {
              props.onChange(value + '\n')
            }
          }
        }}
      />
      <div className='absolute right-1 bottom-0 top-0 flex items-center'>
        {props.loading ? (
          <button className='p-1 rounded-md text-base-content'>
            <div className='flex items-center justify-center text-2xl h-4 w-4 m-1'>
              <span className='animate-blink'>·</span>
              <span className='animate-blink delay-500'>·</span>
              <span className='animate-blink delay-1000'>·</span>
            </div>
          </button>
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
