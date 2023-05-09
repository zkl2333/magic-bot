import { observer } from 'mobx-react-lite'
import interactionStore from '../store/InteractionStore'

const InteractionList = () => {
  return (
    <>
      {interactionStore.interactions.map((item, index) => (
        <div
          key={index}
          className={'rounded-md w-full bg-base-100 shadow mb-3 last:mb-0 hover:shadow-md p-4'}
          onClick={() => {
            interactionStore.setCurrentInteractionId(item.id)
          }}
        >
          <div className='flex justify-between'>
            <div className='truncate flex-1'>{item.title || '未命名对话'}</div>
            <div
              className='btn btn-xs btn-ghost'
              onClick={e => {
                e.stopPropagation()
                interactionStore.deleteInteraction(item.id)
              }}
            >
              删除
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default observer(InteractionList)
