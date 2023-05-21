import classnames from 'classnames'
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import 'katex/dist/katex.min.css'
import '@/common/highlight.less'
import './chatBubble.less'
import dayjs from 'dayjs'
import { Assistant, Message } from '../../types'
import OpenaiIcon from '../../../../components/OpenaiIcon'
import Avatar from '../../../../components/Avatar'
import userStore from '../../../../store/UserStore'

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

interface ChatBubbleProps extends Message {
  loading: boolean
  assistant: Assistant
  onRetry?: (id: Message['id']) => void
  onDeleted?: (id: Message['id']) => void
  onUpdate?: (id: Message['id'], text: Message['content']) => void
}

const ChatBubble = (props: ChatBubbleProps) => {
  const {
    id,
    content: text = '正在思考中...',
    role,
    updatedAt,
    loading,
    assistant,
    onRetry,
    onDeleted,
    onUpdate
  } = props
  const isAssistant = role === 'assistant'

  return (
    <div className={`group chat ${isAssistant ? 'chat-start' : 'chat-end'}`}>
      {isAssistant ? (
        assistant.avatar ? (
          <Avatar className='chat-image w-10 rounded-full overflow-hidden' url={assistant.avatar} />
        ) : (
          <div className='chat-image avatar'>
            <div className='shrink-0 avatar w-10 h-10 rounded-full overflow-hidden'>
              <OpenaiIcon
                style={{
                  backgroundColor: 'rgb(16, 163, 127)'
                }}
                className='p-1.5 text-[#fff]'
              />
            </div>
          </div>
        )
      ) : (
        <Avatar className='chat-image w-10 rounded-full overflow-hidden' email={userStore.email} />
      )}
      {isAssistant ? (
        <div
          className={classnames(
            'prose prose-sm md:prose-md lg:prose-lg chat-bubble bg-base-100 text-base-content markdown-body dark p-3 shadow max-w-full',
          )}
          dangerouslySetInnerHTML={{ __html: mdi.render(text) }}
        />
      ) : (
        <div
          className={classnames(
            'prose prose-sm md:prose-md lg:prose-lg chat-bubble bg-base-100 text-base-content markdown-body dark p-3 shadow whitespace-pre-wrap max-w-full'
          )}
        >
          {text}
        </div>
      )}
      <div className='group-hover:visible chat-footer pt-1 text-xs'>
        <span className='opacity-40'>{dayjs(updatedAt).format('YY/MM/DD HH:mm')}</span>
        {onDeleted && (
          <button
            className='ml-2 opacity-50 text-xs hover:text-primary hover:opacity-100'
            onClick={() => {
              onDeleted(id)
            }}
          >
            删除
          </button>
        )}
        {onRetry && role === 'assistant' && !loading && (
          <button
            className='ml-2 opacity-50 text-xs hover:text-primary hover:opacity-100'
            onClick={() => {
              onRetry(id)
            }}
          >
            重试
          </button>
        )}
        {onUpdate && role === 'user' && (
          <button
            className='ml-2 opacity-50 text-xs hover:text-primary hover:opacity-100'
            onClick={() => {
              const newMessage = prompt('编辑您消息', text)
              if (!newMessage) return
              onUpdate(id, newMessage)
            }}
          >
            编辑
          </button>
        )}
      </div>
    </div>
  )
}

export default ChatBubble
