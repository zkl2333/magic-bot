import 'katex/dist/katex.min.css'
import '@/common/highlight.less'
import './markdownRenderer.less'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import classNames from 'classnames'
import { useState } from 'react'

interface MarkdownRendererProps {
  className?: string
  text: string
}

function CodeBlock({ node, inline, className, children, ...props }: any) {
  const value = typeof children === 'string' ? children : children.join('\n')
  const match = /language-(\w+)/.exec(className || '')
  let language = match ? match[1] : null

  const [clipboard, setClipboard] = useState(false)

  return !inline ? (
    <div className='bg-black rounded-md'>
      <div className='flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md'>
        <span>{language}</span>
        {clipboard ? (
          <>
            <button className='flex ml-auto gap-2'>
              <svg
                stroke='currentColor'
                fill='none'
                strokeWidth='2'
                viewBox='0 0 24 24'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='h-4 w-4'
                height='1em'
                width='1em'
                xmlns='http://www.w3.org/2000/svg'
              >
                <polyline points='20 6 9 17 4 12'></polyline>
              </svg>
              Copied!
            </button>
          </>
        ) : (
          <button
            className='flex ml-auto gap-2'
            onClick={() => {
              navigator.clipboard.writeText(value)
              setClipboard(true)
              setTimeout(() => {
                setClipboard(false)
              }, 1000)
            }}
          >
            <svg
              stroke='currentColor'
              fill='none'
              strokeWidth='2'
              viewBox='0 0 24 24'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='h-4 w-4'
              height='1em'
              width='1em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'></path>
              <rect x='8' y='2' width='8' height='4' rx='1' ry='1'></rect>
            </svg>
            Copy code
          </button>
        )}
      </div>
      <SyntaxHighlighter
        {...props}
        language={language}
        useInlineStyles={false}
        children={String(children).replace(/\n$/, '')}
        PreTag={props => <div {...props} className={classNames('p-4 overflow-y-auto')} />}
        CodeTag={props => <code {...props} className={classNames(className, 'hljs', className)} />}
      />
    </div>
  ) : (
    <code {...props} className={classNames(className, 'inline')}>
      {children}
    </code>
  )
}

const MarkdownRenderer = ({ text, className }: MarkdownRendererProps) => {
  return (
    <>
      <ReactMarkdown
        className={classNames('prose markdown-body dark:prose-invert', className)}
        components={{
          code: CodeBlock
        }}
      >
        {text}
      </ReactMarkdown>
    </>
  )
}

export default MarkdownRenderer
