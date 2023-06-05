import { useState } from 'react'
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

  const navLinkClassNames = ({ isActive }: { isActive: boolean; isPending: boolean }) =>
    classNames({
      '!active': isActive
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
              返回
            </NavLink>
          </div>
          <ul className='menu p-4 text-base-content'>
            <li>
              <NavLink to='/settings/user' className={navLinkClassNames}>
                {({ isPending }) => (
                  <>
                    <PersonOutlinedIcon />
                    个人信息
                    {isPending && <span className='loading loading-ring loading-xs'></span>}
                  </>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to='/settings/security' className={navLinkClassNames}>
                {({ isPending }) => (
                  <>
                    <VerifiedUserOutlinedIcon />
                    安全设置
                    {isPending && <span className='loading loading-ring loading-xs'></span>}
                  </>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to='/settings/balance' className={navLinkClassNames}>
                {({ isPending }) => (
                  <>
                    <AccountBalanceWalletOutlinedIcon />
                    账户余额
                    {isPending && <span className='loading loading-ring loading-xs'></span>}
                  </>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to='/settings/transactions' className={navLinkClassNames}>
                {({ isPending }) => (
                  <>
                    <DescriptionOutlinedIcon />
                    积分明细
                    {isPending && <span className='loading loading-ring loading-xs'></span>}
                  </>
                )}
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
      <div className='flex-1 flex overflow-hidden'>
        <Outlet context={{ title, setTitle }} />
      </div>
    </SidebarLayout>
  )
}

export default User
