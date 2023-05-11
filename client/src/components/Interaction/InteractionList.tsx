import { observer } from 'mobx-react-lite'
import interactionStore from '../../store/InteractionStore'
import Interactions from './Interactions'

const InteractionList = () => {
  return (
    <>
      {interactionStore.interactions.map(interactions => (
        <Interactions key={interactions.id} interactions={interactions} />
      ))}
    </>
  )
}

export default observer(InteractionList)
