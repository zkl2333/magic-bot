import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import 'katex/dist/katex.min.css'
import '@/common/highlight.less'
import './markdownRenderer.less'
import classNames from 'classnames'

function highlightBlock(str: string, lang?: string) {
  return `<pre data-theme='black' class="border-none code-block-wrapper"><code class="hljs code-block-body ${lang}">${str}</code></pre>`
}

const mdi = new MarkdownIt({
  html: false,
  linkify: true,
  highlight(code, language) {
    const validLang = !!(language && hljs.getLanguage(language))
    if (validLang) {
      const lang = language ?? ''
      return highlightBlock(hljs.highlight(code, { language: lang }).value, lang)
    }
    return highlightBlock(hljs.highlightAuto(code).value, '')
  }
})

mdi.use(mila, { attrs: { target: '_blank', rel: 'noopener' } })
mdi.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' })

interface MarkdownRendererProps {
  className?: string
  text: string
}

const MarkdownRenderer = ({ text, className }: MarkdownRendererProps) => {
  return (
    <div
      className={classNames('prose prose-sm md:prose-md lg:prose-lg markdown-body dark shadow', className)}
      dangerouslySetInnerHTML={{ __html: mdi.render(text) }}
    />
  )
}

export default MarkdownRenderer
