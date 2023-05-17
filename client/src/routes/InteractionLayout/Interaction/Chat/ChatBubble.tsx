import classnames from 'classnames'
import userStore from '../../../../store/UserStore'
import { IMessage } from '../../../../types'
import Avatar from '../../../../components/Avatar'
import OpenaiIcon from '../../../../components/OpenaiIcon'
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import 'katex/dist/katex.min.css'
import '../../../../common/highlight.less'
import './chatBubble.less'
import dayjs from 'dayjs'
import interactionStore from '../../../../store/InteractionStore'

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

interface ChatBubbleProps extends IMessage {
  // 重试
  retry: (id: IMessage['id']) => void
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
      {isAssistant ? (
        <div
          className={classnames(
            'prose prose-sm md:prose-md lg:prose-lg chat-bubble bg-base-100 text-base-content markdown-body dark p-3 shadow'
          )}
          dangerouslySetInnerHTML={{ __html: mdi.render(message) }}
        />
      ) : (
        <div
          className={classnames(
            'prose prose-sm md:prose-md lg:prose-lg chat-bubble bg-base-100 text-base-content markdown-body dark p-3 shadow whitespace-pre-wrap'
          )}
        >
          {message}
        </div>
      )}
      <div className='group-hover:visible chat-footer pt-1 text-xs'>
        <span className='opacity-40'>{dayjs(updatedAt).format('YY/MM/DD HH:mm')}</span>
        <button
          className='ml-2 opacity-50 text-xs hover:text-primary hover:opacity-100'
          onClick={() => {
            interactionStore.deleteMessage(id)
          }}
        >
          删除
        </button>
        {role === 'assistant' && !exclude && !interactionStore.currentInteraction?.loading && (
          <button
            className='ml-2 opacity-50 text-xs hover:text-primary hover:opacity-100'
            onClick={() => {
              retry(id)
            }}
          >
            重试
          </button>
        )}
        {role === 'user' && (
          <button
            className='ml-2 opacity-50 text-xs hover:text-primary hover:opacity-100'
            onClick={() => {
              const newMessage = prompt('编辑您消息', message)
              if (newMessage) {
                interactionStore.createOrUpdateMessage({
                  id,
                  message: newMessage
                })
              }
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
