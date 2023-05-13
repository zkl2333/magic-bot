import { observer } from 'mobx-react-lite'
import interactionStore from '../../store/InteractionStore'
import Chat from './Chat/Chat'
import SelectInteractionType from './SelectInteractionType/SelectInteractionType'

const Interaction = () => {
  {
    switch (interactionStore.currentInteraction?.type) {
      case 'chat':
        return <Chat />
      default:
        return <SelectInteractionType />
    }
  }
}

export default observer(Interaction)
