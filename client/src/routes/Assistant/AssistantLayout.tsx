import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams
} from 'react-router-dom'
import AssistantSidebar from './AssistantSidebar'
import { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import userStore from '../../store/UserStore'
import Avatar from '../../components/Avatar'
import { SidebarLayout } from '../../components/SidebarLayout'
import { RootContextProps } from '../Root/Root'
import { Assistant } from '../../service/assistant'

function AssistantLayout() {
  const { assistantList } = useLoaderData() as { assistantList: Array<Assistant> }
  const [showAssistantLayoutSidebar, setAssistantLayoutShowSidebar] = useState(false)
  const context = useOutletContext<RootContextProps>()
  const { title } = context
  const navigate = useNavigate()

  const { assistantId } = useParams()
  const location = useLocation()

  if (location.pathname === '/assistant') {
    if (assistantList.length === 0) {
      return <Navigate to='/assistant/new' replace={true} />
    } else {
      const assistant = assistantList[0]
      return <Navigate to={`/assistant/${assistant.id}`} replace={true} />
    }
  }

  return (
    <SidebarLayout
      hasSidebar={assistantList.length > 0}
      showSidebar={showAssistantLayoutSidebar}
      setShowSidebar={setAssistantLayoutShowSidebar}
      sidebarContent={
        <AssistantSidebar
          setAssistantLayoutShowSidebar={setAssistantLayoutShowSidebar}
          assistantList={assistantList}
        />
      }
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
          {assistantId ? (
            <Link to={`/assistant/${assistantId}/edit`} className='btn btn-ghost normal-case text-xl'>
              {title || '机仆乐园'}
            </Link>
          ) : (
            <div className='h-12 flex items-center px-4 font-bold normal-case text-xl'>
              {title || '机仆乐园'}
            </div>
          )}
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
                <NavLink to='/settings'>设置</NavLink>
              </li>
              <li
                onClick={() => {
                  localStorage.clear()
                  userStore.clear()
                  navigate('/login', { replace: true })
                }}
              >
                <a>退出登录</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Outlet context={context} />
    </SidebarLayout>
  )
}

export default AssistantLayout
