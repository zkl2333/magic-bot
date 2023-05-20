import { NavLink, Outlet, useLoaderData } from 'react-router-dom'
import AssistantSidebar from './AssistantSidebar'
import { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import userStore from '../../store/UserStore'
import Avatar from '../../components/Avatar'
import { Assistant } from './types'
import { SidebarLayout } from '../../components/SidebarLayout'

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
    <SidebarLayout
      hasSidebar={assistantList.length > 0}
      showSidebar={showAssistantLayoutSidebar}
      setShowSidebar={setAssistantLayoutShowSidebar}
      sidebarContent={<AssistantSidebar assistantList={assistantList} />}
    >
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
              className='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-36'
            >
              <li>
                <NavLink to='/user'>用户设置</NavLink>
              </li>
              <li onClick={() => userStore.logout()}>
                <a>退出登录</a>
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
    </SidebarLayout>
  )
}

export default AssistantLayout
