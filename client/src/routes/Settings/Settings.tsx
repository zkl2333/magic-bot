import { useEffect, useState } from 'react'
import { SidebarLayout } from '../../components/SidebarLayout'
import MenuIcon from '@mui/icons-material/Menu'
import { NavLink, Outlet, useOutletContext } from 'react-router-dom'
import { RootContextProps } from '../Root/Root'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import classNames from 'classnames'
const User = () => {
  const [showUserLayoutSidebar, setUserLayoutShowSidebar] = useState(false)
  const { title, setTitle } = useOutletContext<RootContextProps>()

  const navLinkClassNames = ({ isActive, isPending }: { isActive: boolean; isPending: boolean }) =>
    classNames('group', {
      active: isActive,
      loading: isPending
    })

  return (
    <SidebarLayout
      showSidebar={showUserLayoutSidebar}
      setShowSidebar={setUserLayoutShowSidebar}
      sidebarContent={
        <div className='overflow-hidden h-full w-60 text-base-content border-base-300 border-r bg-base-200'>
          <div className='border-b border-base-300 flex justify-center items-center p-3 text-center h-16'>
            <NavLink
              to='/assistant'
              className={({ isActive }) =>
                classNames('btn btn-ghost normal-case text-xl w-full h-full', {
                  'bg-base-300': isActive
                })
              }
            >
            🤖 AI Web
            </NavLink>
          </div>
          <ul className='menu p-4 text-base-content'>
            <li>
              <NavLink to='/settings/user' className={navLinkClassNames}>
                <PersonOutlinedIcon />
                个人信息
                <button className='btn btn-ghost invisible group-[.loading]:visible group-[.loading]:loading btn-xs'></button>
              </NavLink>
            </li>
            <li>
              <NavLink to='/settings/security' className={navLinkClassNames}>
                <VerifiedUserOutlinedIcon />
                安全设置
                <button className='btn btn-ghost invisible group-[.loading]:visible group-[.loading]:loading btn-xs'></button>
              </NavLink>
            </li>
            <li>
              <NavLink to='/settings/balance' className={navLinkClassNames}>
                <AccountBalanceWalletOutlinedIcon />
                账户余额
                <button className='btn btn-ghost invisible group-[.loading]:visible group-[.loading]:loading btn-xs'></button>
              </NavLink>
            </li>
            <li>
              <NavLink to='/settings/transactions' className={navLinkClassNames}>
                <DescriptionOutlinedIcon />
                消费明细
                <button className='btn btn-ghost invisible group-[.loading]:visible group-[.loading]:loading btn-xs'></button>
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
      <Outlet context={{ title, setTitle }} />
    </SidebarLayout>
  )
}

export default User
