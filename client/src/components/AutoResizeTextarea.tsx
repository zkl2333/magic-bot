import TextareaAutosize from '@mui/base/TextareaAutosize'

interface AutoResizeTextareaProps {
  minHeight?: number
  maxHeight?: number
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
}

const AutoResizeTextarea = (props: AutoResizeTextareaProps) => {
  const { value, onChange } = props

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value)
  }

  return (
    <div className='flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-base-300 bg-base-100 rounded-md shadow-lg'>
      <TextareaAutosize
        value={value}
        placeholder='Enter 发送，Ctrl+Enter 换行'
        className='m-0 outline-none w-full resize-none border-0 bg-transparent p-0 pr-9 focus:ring-0 focus-visible:ring-0 pl-2 md:pl-0 overflow-y-hidden'
        onChange={handleChange}
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
      ></TextareaAutosize>
      <div className='absolute right-1 bottom-0 top-0 flex items-center'>
        <button
          className='p-1 rounded-md text-base-content hover:bg-base-300 disabled:opacity-40'
          disabled={value.length === 0}
          onClick={() => props.onSubmit?.()}
        >
          <svg
            stroke='currentColor'
            fill='none'
            strokeWidth='2'
            viewBox='0 0 24 24'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='h-4 w-4 m-1'
            height='1em'
            width='1em'
            xmlns='http://www.w3.org/2000/svg'
          >
            <line x1='22' y1='2' x2='11' y2='13'></line>
            <polygon points='22 2 15 22 11 13 2 9 22 2'></polygon>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default AutoResizeTextarea
