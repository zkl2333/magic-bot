import 'katex/dist/katex.min.css'
import '@/common/highlight.less'
import './markdownRenderer.less'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import classNames from 'classnames'
import { forwardRef, useEffect, useMemo, useRef, useState, useImperativeHandle } from 'react'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import mermaid from 'mermaid'
import 'katex/dist/katex.min.css'
import DownloadIcon from '@mui/icons-material/Download'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useDebounce } from '@/hooks'

mermaid.initialize({
  startOnLoad: false,
  flowchart: { useMaxWidth: false, htmlLabels: true }
})

function downloadInlineSVG(svgString: string, filename = 'download.svg') {
  // 创建一个新的 Blob 对象
  const svgData = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })

  // 创建一个 <a> 元素，并设置下载属性
  const linkElement = document.createElement('a')
  linkElement.href = URL.createObjectURL(svgData)
  linkElement.download = filename

  // 触发点击事件进行下载
  linkElement.click()
}

function openInlineSVG(svgString: string) {
  // 创建一个新的 Blob 对象
  const svgData = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })

  // 创建一个临时的 URL
  const url = URL.createObjectURL(svgData)

  // 在新窗口中打开 SVG
  window.open(url, '_blank')

  // 释放 URL 对象
  URL.revokeObjectURL(url)
}

interface MarkdownRendererProps {
  showRow?: boolean
  className?: string
  text: string
}

const MermaidBlock = forwardRef<
  {
    download: () => void
    open: () => void
  },
  { value: string }
>(({ value }, ref) => {
  const [innerHtml, setInnerHtml] = useState('')
  const id = useMemo(() => Math.random().toString(36).slice(2, 7), [])
  const divRef = useRef<HTMLDivElement>(null)
  const bindFunctionsRef = useRef<((element: Element) => void) | null>(null)

  const render = useDebounce(async () => {
    try {
      if (await mermaid.parse(value)) {
        const { svg, bindFunctions } = await mermaid.render('mermaid-svg-' + id, value)
        setInnerHtml(svg)
        if (bindFunctions) {
          bindFunctionsRef.current = bindFunctions
        }
      }
    } catch (error) {}
  }, 300)

  useEffect(() => {
    render()
  }, [value])

  useEffect(() => {
    if (divRef.current && bindFunctionsRef.current) {
      bindFunctionsRef.current(divRef.current)
    }
  }, [innerHtml])

  useImperativeHandle(ref, () => ({
    download: () => {
      downloadInlineSVG(innerHtml, id + '.svg')
    },
    open: () => {
      openInlineSVG(innerHtml)
    }
  }))

  return (
    <div
      style={{
        fontFamily: "'trebuchet ms', verdana, arial"
      }}
      className='p-4 overflow-auto'
    >
      <div className='min-w-[300px] min-h-[50px]' ref={divRef} dangerouslySetInnerHTML={{ __html: innerHtml }} />
    </div>
  )
})

function CodeBlock({ node, inline, className, children, ...props }: any) {
  const value = typeof children === 'string' ? children : children.join('\n')
  const match = /language-(\w+)/.exec(className || '')
  let language = match ? match[1] : null

  const [clipboard, setClipboard] = useState(false)

  const isMermaid = language === 'mermaid'

  const ref = useRef<{
    download: () => void
    open: () => void
  }>(null)

  return !inline ? (
    <div
      data-theme='dark'
      className={classNames('rounded-md border border-gray-800 overflow-hidden', {
        'bg-white w-full': isMermaid,
        'bg-black min-w-[200px]': !isMermaid
      })}
    >
      <div className='flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between'>
        <span className='flex'>
          <span>{language}</span>
          {isMermaid && (
            <>
              <button
                className='flex ml-2 gap-2'
                onClick={() => {
                  ref.current?.open()
                }}
              >
                <OpenInNewIcon
                  style={{
                    fontSize: '1rem'
                  }}
                />
              </button>
              <button
                className='flex ml-2 gap-2'
                onClick={() => {
                  ref.current?.download()
                }}
              >
                <DownloadIcon
                  style={{
                    fontSize: '1rem'
                  }}
                />
              </button>
            </>
          )}
        </span>
        <div className='flex'>
          <span>
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
          </span>
        </div>
      </div>

      {isMermaid ? (
        <MermaidBlock value={value} ref={ref} />
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
