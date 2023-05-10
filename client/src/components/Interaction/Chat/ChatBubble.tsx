import classNames from 'classnames'
import userStore from '../../../store/UserStore'
import { MessageItem } from '../../../types'
import Avatar from '../../Avatar'
import OpenaiIcon from '../../OpenaiIcon'
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import 'katex/dist/katex.min.css'
import '../../../common/highlight.less'
import '../../../common/chatBubble.less'

function highlightBlock(str: string, lang?: string) {
  return `<pre class="code-block-wrapper"><code class="hljs code-block-body ${lang}">${str}</code></pre>`
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

const ChatBubble = (props: MessageItem) => {
  const { message = '正在思考中...', role } = props
  const isAssistant = role === 'assistant'

  return (
    <div className={`loading chat ${isAssistant ? 'chat-start' : 'chat-end'}`}>
      {isAssistant ? (
        <div className='chat-image avatar'>
          <div className='w-10 rounded-full text-white bg-black p-1.5'>
            <OpenaiIcon />
          </div>
        </div>
      ) : (
        <Avatar className='chat-image w-10 rounded-full overflow-hidden' email={userStore.email} />
      )}
      <div
        className={classNames(
          'prose-sm lg:prose chat-bubble bg-base-100 text-base-content markdown-body dark p-3 shadow'
        )}
        dangerouslySetInnerHTML={{ __html: mdi.render(message) }}
      ></div>
    </div>
  )
}

export default ChatBubble
