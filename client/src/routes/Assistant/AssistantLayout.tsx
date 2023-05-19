import { Outlet, useLoaderData } from 'react-router-dom'
import AssistantSidebar from './AssistantSidebar'
import { IAssistant } from '../../types'
import { useState } from 'react'
import classNames from 'classnames'

export type AssistantLayoutContextProps = {
  showAssistantLayoutSidebar: boolean
  setAssistantLayoutShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

function AssistantLayout() {
  const { assistantList } = useLoaderData() as { assistantList: IAssistant[] }
  const [showAssistantLayoutSidebar, setAssistantLayoutShowSidebar] = useState(false)

  return (
    <>
      <div className={classNames('drawer drawer-mobile h-full bg-base-200')}>
        <input
          className='drawer-toggle'
          id='assistant-side-drawer'
          type='checkbox'
          checked={showAssistantLayoutSidebar}
          onChange={e => {
            setAssistantLayoutShowSidebar(e.target.checked)
          }}
        />
        <div className='drawer-content safe-area flex flex-col bg-base-200'>
          <Outlet
            context={{
              showAssistantLayoutSidebar,
              setAssistantLayoutShowSidebar
            }}
          />
        </div>
        {assistantList.length > 0 && (
          <div className='drawer-side'>
            <label
              className='drawer-overlay'
              onClick={() => {
                setAssistantLayoutShowSidebar(false)
              }}
            ></label>
            <div className='w-60'>
              <AssistantSidebar assistantList={assistantList} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default AssistantLayout
