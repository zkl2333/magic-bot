import { useEffect, useState } from 'react'
import { SidebarLayout } from '../../components/SidebarLayout'
import MenuIcon from '@mui/icons-material/Menu'
import { NavLink, Outlet, useOutletContext } from 'react-router-dom'
import { RootContextProps } from '../Root/Root'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
const User = () => {
  const [showUserLayoutSidebar, setUserLayoutShowSidebar] = useState(false)
  const { title, setTitle } = useOutletContext<RootContextProps>()

  useEffect(() => {
    setTitle('用户设置')
    return () => {
      setTitle('')
    }
  }, [])

  return (
    <SidebarLayout
      showSidebar={showUserLayoutSidebar}
      setShowSidebar={setUserLayoutShowSidebar}
      sidebarContent={
        <div className='overflow-hidden h-full w-60 text-base-content border-base-300 border-r bg-base-200'>
          <ul className='menu p-4 text-base-content'>
            <li>
              <NavLink to='/settings/profile'>
                <PersonOutlinedIcon />
                个人信息
              </NavLink>
            </li>
            <li>
              <NavLink to='/settings/security'>
                <VerifiedUserOutlinedIcon />
                安全设置
              </NavLink>
            </li>
            <li>
              <NavLink to='/settings/balance'>
                <AccountBalanceWalletOutlinedIcon />
                账户余额
              </NavLink>
            </li>
            <li>
              <NavLink to='/settings/transactions'>
                <DescriptionOutlinedIcon />
                消费明细
              </NavLink>
            </li>
          </ul>
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
        <div className='flex-1 px-2 mx-2'>{title}</div>
      </div>
      <Outlet />
    </SidebarLayout>
  )
}

export default User
