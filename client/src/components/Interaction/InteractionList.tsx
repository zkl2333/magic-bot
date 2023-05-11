import { observer } from 'mobx-react-lite'
import interactionStore from '../../store/InteractionStore'
import Interactions from './Interactions'

const InteractionList = () => {
  return (
    <>
      {interactionStore.interactions.map((item, index) => (
        <Interactions key={index} {...item} />
      ))}
    </>
  )
}

export default observer(InteractionList)
