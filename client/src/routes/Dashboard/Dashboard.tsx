import { useState } from 'react'
import { SidebarLayout } from '../../components/SidebarLayout'
import MenuIcon from '@mui/icons-material/Menu'
import { NavLink, Outlet, useOutletContext } from 'react-router-dom'
import { RootContextProps } from '../Root'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
// import CardMembershipIcon from '@mui/icons-material/CardMembership'
import classNames from 'classnames'
import userStore from '@/store/UserStore'

const Dashboard = () => {
  const [showUserLayoutSidebar, setUserLayoutShowSidebar] = useState(false)
  const { title, setTitle } = useOutletContext<RootContextProps>()

  const navLinkClassNames = ({ isActive }: { isActive: boolean; isPending: boolean }) =>
    classNames({
      active: isActive
    })

  const sidebarLinks = [
    {
      path: '/dashboard/user',
      icon: <PersonOutlinedIcon />,
      label: '个人信息'
    },
    // {
    //   path: '/dashboard/my-subscription',
    //   icon: <CardMembershipIcon />,
    //   label: '我的订阅'
    // },
    {
      path: '/dashboard/balance',
      icon: <AccountBalanceWalletOutlinedIcon />,
      label: '账户余额'
    },
    {
      path: '/dashboard/transactions',
      icon: <DescriptionOutlinedIcon />,
      label: '积分明细'
    },
    {
      path: '/dashboard/security',
      icon: <VerifiedUserOutlinedIcon />,
      label: '安全设置'
    }
  ]

  const adminSidebarLinks = [
    {
      path: '/dashboard/config',
      icon: <PersonOutlinedIcon />,
      label: '配置管理'
    },
    // {
    //   path: '/dashboard/subscription',
    //   icon: <PersonOutlinedIcon />,
    //   label: '订阅管理'
    // },
    // {
    //   path: '/dashboard/subscription-service-limit',
    //   icon: <PersonOutlinedIcon />,
    //   label: '服务限制'
    // }
  ]

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
            {sidebarLinks.map(link => (
              <li key={link.path}>
                <NavLink to={link.path} className={navLinkClassNames}>
                  {({ isPending }) => (
                    <>
                      {link.icon}
                      {link.label}
                      {isPending && <span className='loading loading-ring loading-xs'></span>}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
            {userStore.role === 'ADMIN' && (
              <>
                <li className='menu-title'>
                  <span>管理员</span>
                </li>
                {adminSidebarLinks.map(link => (
                  <li key={link.path}>
                    <NavLink to={link.path} className={navLinkClassNames}>
                      {({ isPending }) => (
                        <>
                          {link.icon}
                          {link.label}
                          {isPending && <span className='loading loading-ring loading-xs'></span>}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </>
            )}
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

export default Dashboard
