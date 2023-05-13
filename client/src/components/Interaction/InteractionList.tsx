import { observer } from 'mobx-react-lite'
import interactionStore from '../../store/InteractionStore'
import InteractionItem from './InteractionItem'

const InteractionList = () => {
  return (
    <>
      {interactionStore.interactions.map(interactions => (
        <InteractionItem key={interactions.id} interactions={interactions} />
      ))}
    </>
  )
}

export default observer(InteractionList)
