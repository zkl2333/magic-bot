import { observer } from 'mobx-react-lite'
import interactionStore from '../../store/InteractionStore'
import Chat from './Chat/Chat'
import SelectInteractionMode from './SelectInteractionMode/SelectInteractionMode'
import { useLoaderData } from 'react-router-dom'

type LoaderDataType = {
  interactionID: string
}

const Interaction = () => {
  const { interactionID } = useLoaderData() as LoaderDataType
  interactionStore.setCurrentInteractionId(interactionID)

  switch (interactionStore.currentInteraction?.mode) {
    case 'chat':
      return <Chat />
    default:
      return <SelectInteractionMode />
  }
}

export default observer(Interaction)
