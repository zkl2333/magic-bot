import { useState } from 'react'
import { SidebarLayout } from '../../components/SidebarLayout'
import MenuIcon from '@mui/icons-material/Menu'

const User = () => {
  const [showUserLayoutSidebar, setUserLayoutShowSidebar] = useState(false)

  return (
    <SidebarLayout
      showSidebar={showUserLayoutSidebar}
      setShowSidebar={setUserLayoutShowSidebar}
      sidebarContent={
        <div className='overflow-hidden h-full w-60 text-base-content border-base-300 border-r bg-base-200'>
          sidebar
        </div>
      }
    >
      <div className='navbar bg-base-200 border-b border-base-300'>
        <button
          className='btn btn-square btn-ghost lg:hidden'
          onClick={() => {
            setUserLayoutShowSidebar(true)
          }}
        >
          <MenuIcon />
        </button>
        navBar
      </div>
      User
    </SidebarLayout>
  )
}

export default User
