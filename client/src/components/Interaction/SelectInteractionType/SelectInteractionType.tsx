import interactionStore from '../../../store/InteractionStore'
import { SESSION_TYPE } from '../../../types'
import chatImage from './chat.jpg'
import unfinishedImage from './unfinished.png'

function SelectInteractionType() {
  const typeList = [
    {
      name: '对话模式',
      type: SESSION_TYPE['CHAT'],
      image: chatImage,
      description: '和 AI 用对话的形式交互,更自然的交互体验、及时的反馈和调整、广泛的应用场景。'
    }
  ]

  return (
    <div
      className='w-full p-2 md:p-4 grid gap-2 md:gap-4'
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))'
      }}
    >
      {typeList.map(type => {
        return (
          <div className='card bg-base-100 h-full shadow-lg image-full before:!opacity-50'>
            <figure className='relative'>
              <img className='absolute w-full' src={chatImage} alt='chat' />
            </figure>
            <div className='card-body'>
              <h2 className='card-title '>🤖 {type.name}</h2>
              <p className='text-sm md:text-base'>{type.description}</p>
              <div className='card-actions justify-end'>
                <button
                  className='btn btn-primary btn-sm md:btn-md'
                  onClick={() => {
                    interactionStore.createOrUpdateInteraction({
                      id: interactionStore.currentInteractionId,
                      type: SESSION_TYPE['CHAT']
                    })
                  }}
                >
                  立即开始
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

export default SelectInteractionType
