import 'katex/dist/katex.min.css'
import '@/common/highlight.less'
import './markdownRenderer.less'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import classNames from 'classnames'
import { useEffect, useMemo, useState } from 'react'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import mermaid from 'mermaid'
import 'katex/dist/katex.min.css'

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  flowchart: { useMaxWidth: false, htmlLabels: true }
})

interface MarkdownRendererProps {
  showRow?: boolean
  className?: string
  text: string
}

const MermaidBlock = ({ value }: { value: string }) => {
  const [innerHtml, setInnerHtml] = useState('')
  const id = useMemo(() => Math.random().toString(36).slice(2, 7), [])

  const render = async () => {
    try {
      if (await mermaid.parse(value)) {
        const { svg } = await mermaid.render('mermaid-svg' + id, value)
        setInnerHtml(svg)
      }
    } catch (error) {}
  }

  useEffect(() => {
    render()
  }, [value])

  return <div className='p-4 overflow-y-auto' dangerouslySetInnerHTML={{ __html: innerHtml }} />
}

function CodeBlock({ node, inline, className, children, ...props }: any) {
  const value = typeof children === 'string' ? children : children.join('\n')
  const match = /language-(\w+)/.exec(className || '')
  let language = match ? match[1] : null

  const [clipboard, setClipboard] = useState(false)

  return !inline ? (
    <div data-theme='dark' className='bg-black rounded-md border border-gray-800 min-w-[200px]'>
      <div className='flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between'>
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

      {language === 'mermaid' ? (
        <MermaidBlock value={value} />
      ) : (
        <SyntaxHighlighter
          {...props}
          language={language}
          useInlineStyles={false}
          children={String(children).replace(/\n$/, '')}
          PreTag={props => <div {...props} className={classNames('p-4 overflow-y-auto', className)} />}
          CodeTag={props => <code {...props} className={classNames('hljs')} />}
        />
      )}
    </div>
  ) : (
    <code {...props} className={classNames(className, 'inline')}>
      {children}
    </code>
  )
}

const MarkdownRenderer = ({ text, className, showRow }: MarkdownRendererProps) => {
  return useMemo(() => {
    return (
      <div className={classNames('markdown-body dark:prose-invert', className)}>
        {showRow ? (
          <CodeBlock inline={false} className='language-markdown'>
            {text}
          </CodeBlock>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code: CodeBlock
            }}
          >
            {text}
          </ReactMarkdown>
        )}
      </div>
    )
  }, [text, showRow])
}

export default MarkdownRenderer
