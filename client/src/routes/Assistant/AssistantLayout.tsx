import { Outlet, useLoaderData } from 'react-router-dom'
import AssistantSidebar from './AssistantSidebar'
import { useState } from 'react'
import classNames from 'classnames'
import MenuIcon from '@mui/icons-material/Menu'
import userStore from '../../store/UserStore'
import Avatar from '../../components/Avatar'
import { Assistant } from './types'

export type AssistantLayoutContextProps = {
  setTitle: React.Dispatch<React.SetStateAction<string>>
}

function AssistantLayout() {
  const { assistantList } = useLoaderData() as { assistantList: Assistant[] }
  const [showAssistantLayoutSidebar, setAssistantLayoutShowSidebar] = useState(false)
  const [title, _setTitle] = useState('')

  const setTitle = (title: string) => {
    _setTitle(title)
    document.title = `${title} - AI Web`
  }

  return (
    <>
      <div className={classNames('safe-area drawer drawer-mobile h-full bg-base-200')}>
        <input
          className='drawer-toggle'
          id='assistant-side-drawer'
          type='checkbox'
          checked={showAssistantLayoutSidebar}
          onChange={e => {
            setAssistantLayoutShowSidebar(e.target.checked)
          }}
        />
        <div className='drawer-content flex flex-col bg-base-200'>
          <div className='navbar bg-base-200 border-b border-base-300'>
            {assistantList.length > 0 && (
              <button
                className='btn btn-square btn-ghost lg:hidden'
                onClick={() => {
                  setAssistantLayoutShowSidebar(true)
                }}
              >
                <MenuIcon />
              </button>
            )}
            <div className='flex-1'>
              <a className='btn btn-ghost normal-case text-xl'>{title || 'AI Web'}</a>
            </div>
            <div className='flex-none'>
              <div className='dropdown dropdown-end'>
                <label tabIndex={0} className='btn btn-ghost btn-circle avatar'>
                  <Avatar className='w-10 rounded-full' email={userStore.email} />
                </label>
                <ul
                  tabIndex={0}
                  className='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52'
                >
                  {/* <li>
                    <a className='justify-between'>
                      Profile
                      <span className='badge'>New</span>
                    </a>
                  </li>
                  <li>
                    <a>Settings</a>
                  </li> */}
                  <li>
                    <a>Logout</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <Outlet
            context={{
              setTitle
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
            <AssistantSidebar assistantList={assistantList} />
          </div>
        )}
      </div>
    </>
  )
}

export default AssistantLayout
