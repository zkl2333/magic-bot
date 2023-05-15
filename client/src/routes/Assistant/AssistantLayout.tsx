import { Outlet, useLoaderData } from 'react-router-dom'
// import Navbar from '../InteractionLayout/Navbar'
import AssistantSidebar from './AssistantSidebar'
import { IAssistant } from '../../types'

function AssistantLayout() {
  const { assistantList } = useLoaderData() as { assistantList: IAssistant[] }
  return (
    <>
      <div className='drawer drawer-mobile h-full bg-base-200'>
        <input id='assistant-side-drawer' type='checkbox' className='drawer-toggle' />
        <div className='safe-area drawer-content flex flex-col bg-base-200'>
          {/* <Navbar /> */}
          <Outlet />
        </div>
        <div className='drawer-side'>
          <label htmlFor='assistant-side-drawer' className='drawer-overlay'></label>
          <AssistantSidebar assistantList={assistantList} />
        </div>
      </div>
    </>
  )
}

export default AssistantLayout
