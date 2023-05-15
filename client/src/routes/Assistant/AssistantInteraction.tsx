import { Outlet, useLoaderData } from 'react-router-dom'
import AssistantInteractionSidebar from './AssistantInteractionSidebar'
import { IAssistant } from '../../types'

const AssistantInteraction = () => {
  const _useLoaderData = useLoaderData() as { assistant: IAssistant; interaction: any }

  console.log(_useLoaderData)

  return (
    <div className='drawer h-full'>
      <input id='assistant-interaction-side-drawer' type='checkbox' className='drawer-toggle' />
      <div className='safe-area drawer-content flex flex-col'>
        {/* <Navbar /> */}
        <label htmlFor='assistant-interaction-side-drawer' className='btn btn-primary drawer-button'>
          Open drawer
        </label>
        <Outlet />
      </div>
      <div className='drawer-side'>
        <label htmlFor='assistant-interaction-side-drawer' className='drawer-overlay'></label>
        <AssistantInteractionSidebar />
      </div>
    </div>
  )
}

export default AssistantInteraction
