import interactionStore from '../../../store/InteractionStore'
import { SESSION_TYPE } from '../../../types'
import chatImage from '../../../assets/chat.jpg'
import unfinishedImage from '../../../assets/unfinished.png'
import generatorImage from '../../../assets/generator.jpg'
import revisionImage from '../../../assets/revision.jpg'
import classnames from 'classnames'

function SelectInteractionMode() {
  const modeList = [
    {
      name: '💬 对话模式',
      examples: ['闲聊娱乐', '编程助手', '职业顾问'],
      type: SESSION_TYPE['CHAT'],
      image: chatImage,
      description: '用对话的形式交互，更自然的交互体验、及时的反馈和调整、广泛的应用场景。',
      disabled: false
    },
    {
      name: '✒️ 生成模式',
      examples: ['问题解答', '代码生成', '文章续写'],
      type: SESSION_TYPE['GENERATOR'],
      image: generatorImage,
      description: '基于用户输入的要求，自动生成符合需求的文本、表格、数据等内容。',
      disabled: true
    },
    {
      name: '📑 修订模式',
      examples: ['文本翻译', '代码重构', '文案优化'],
      type: SESSION_TYPE['REVISION'],
      image: revisionImage,
      description: '通过输入文本并设计修订器，帮助用户基于旧的文本生成新的文本。',
      disabled: true
    }
  ]

  return (
    <div
      className='w-full p-2 md:p-4 grid gap-2 md:gap-4'
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))'
      }}
    >
      {modeList.map(mode => {
        return (
          <div key={mode.name} className='card bg-base-100 h-full shadow-lg image-full before:!opacity-60'>
            <figure className='relative'>
              <img className='absolute w-full' src={mode.image} alt='chat' />
            </figure>
            <div className='card-body p-5'>
              <h2 className='card-title'>{mode.name}</h2>
              <div className='flex flex-wrap'>
                {mode.examples &&
                  mode.examples.map(example => {
                    return (
                      <div className='badge badge-outline glass p-3 m-1 whitespace-nowrap'>{example}</div>
                    )
                  })}
              </div>
              <p className='text-sm md:text-base'>{mode.description}</p>
              <div className='card-actions justify-end'>
                <button
                  className={classnames('btn btn-primary btn-sm', {
                    'btn-disabled glass text-base-300': mode.disabled
                  })}
                  onClick={() => {
                    interactionStore.createOrUpdateInteraction({
                      id: interactionStore.currentInteractionId,
                      mode: SESSION_TYPE['CHAT']
                    })
                    // 兼容处理
                    if (interactionStore.currentInteractionMessages.length === 0) {
                      interactionStore.createOrUpdateMessage({
                        interactionId: interactionStore.currentInteractionId,
                        message: '你好，有什么可以帮到你的吗？',
                        role: 'assistant',
                        exclude: true
                      })
                    }
                  }}
                >
                  {mode.disabled ? '敬请期待' : '立即开始'}
                </button>
              </div>
            </div>
          </div>
        )
      })}
      <div className='card bg-base-100 h-full shadow-lg image-full'>
        <figure className='relative'>
          <img className='absolute w-full' src={unfinishedImage} alt='chat' />
        </figure>
        <div className='card-body justify-center items-center'>
          <h2 className='card-title text-4xl opacity-60'>敬请期待!</h2>
        </div>
      </div>
    </div>
  )
}

export default SelectInteractionMode
