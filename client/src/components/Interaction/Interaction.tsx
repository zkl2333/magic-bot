import interactionStore from '../../store/InteractionStore'
import Chat from './Chat/Chat'

const Interaction = () => {
  {
    switch (interactionStore.currentInteraction?.type) {
      case 'chat':
        return <Chat />
      default:
        return <div>未知的交互类型</div>
    }
  }
}

export default Interaction
