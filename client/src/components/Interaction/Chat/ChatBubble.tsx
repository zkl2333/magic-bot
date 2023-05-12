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
import './chatBubble.less'
import dayjs from 'dayjs'
// import relativeTime from 'dayjs/plugin/relativeTime'
import interactionStore from '../../../store/InteractionStore'

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

interface ChatBubbleProps extends MessageItem {
  // 重试
  retry: (id: MessageItem['id']) => void
}

const ChatBubble = (props: ChatBubbleProps) => {
  const { id, message = '正在思考中...', role, updatedAt, retry, exclude } = props
  const isAssistant = role === 'assistant'

  return (
    <div className={`group chat ${isAssistant ? 'chat-start' : 'chat-end'}`}>
      {isAssistant ? (
        <div className='chat-image avatar'>
          <div className='w-10 rounded-full text-white bg-black p-1.5'>
            <OpenaiIcon />
          </div>
        </div>
      ) : (
        <Avatar className='chat-image w-10 rounded-full overflow-hidden' email={userStore.email} />
      )}
      {/* <div className='chat-header opacity-50 text-xs pb-1'>
        <span>{dayjs(createdAt).format('YY/MM/DD HH:mm')}</span>
      </div> */}
      <div
        className={classNames(
          'prose-sm lg:prose chat-bubble bg-base-100 text-base-content markdown-body dark p-3 shadow'
        )}
        dangerouslySetInnerHTML={{ __html: mdi.render(message) }}
      />
      <div className='group-hover:visible chat-footer pt-1 text-xs'>
        {!exclude && (
          <>
            <span className='opacity-40'>{dayjs(updatedAt).format('YY/MM/DD HH:mm')}</span>
            <button
              className='ml-2 opacity-50 text-xs hover:text-primary hover:opacity-100'
              onClick={() => {
                interactionStore.deleteMessage(id)
              }}
            >
              删除
            </button>
          </>
        )}
        {role === 'assistant' && !exclude && (
          <button
            className='ml-2 opacity-50 text-xs hover:text-primary hover:opacity-100'
            onClick={() => {
              retry(id)
            }}
          >
            重试
          </button>
        )}
      </div>
    </div>
  )
}

export default ChatBubble
