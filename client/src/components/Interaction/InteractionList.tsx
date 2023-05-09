import { observer } from 'mobx-react-lite'
import interactionStore from '../../store/InteractionStore'
import classNames from 'classnames'

const InteractionList = () => {
  return (
    <>
      {interactionStore.interactions.map((item, index) => (
        <button
          key={index}
          className={classNames('btn w-full h-auto px-4 flex justify-between items-center', {
            'btn-ghost': interactionStore.currentInteractionId !== item.id,
            'btn-primary': interactionStore.currentInteractionId === item.id
          })}
          onClick={() => {
            interactionStore.setCurrentInteractionId(item.id)
          }}
        >
          <div className='truncate flex-1 text-left'>{item.title || '未命名对话'}</div>
          <div
            className='btn btn-xs btn-ghost'
            onClick={e => {
              e.stopPropagation()
              interactionStore.deleteInteraction(item.id)
            }}
          >
            删除
          </div>
        </button>
      ))}
    </>
  )
}

export default observer(InteractionList)
