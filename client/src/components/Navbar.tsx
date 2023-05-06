import React from 'react'

// 导航栏
const Navbar: React.FC = () => {
  return (
    <div className='w-full navbar border-b lg:hidden'>
      <div className='flex-none'>
        <label htmlFor='side-drawer' className='btn btn-square btn-ghost '>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            className='inline-block w-5 h-5 stroke-current'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M4 6h16M4 12h16M4 18h16'
            ></path>
          </svg>
        </label>
      </div>
    </div>
  )
}

export default Navbar
