import { observer } from 'mobx-react-lite'
import interactionStore from '../../store/InteractionStore'
import Chat from './Chat/Chat'
import SelectInteractionMode from './SelectInteractionMode/SelectInteractionMode'

const Interaction = () => {
  switch (interactionStore.currentInteraction?.mode) {
    case 'chat':
      return <Chat />
    default:
      return <SelectInteractionMode />
  }
}

export default observer(Interaction)
