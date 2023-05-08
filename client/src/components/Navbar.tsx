import React from 'react'
import userStore from '../store/UserStore'
import { observer } from 'mobx-react-lite'

// 导航栏
const Navbar: React.FC = () => {
  const themeList = [
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
    'night',
    'coffee',
    'winter'
  ]
  return (
    <div className='w-full navbar border-b border-base-300'>
      <div className='flex-none lg:hidden'>
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
      <div className='flex-1'></div>
      <div title='Change Theme' className='dropdown dropdown-end'>
        <div tabIndex={0} className='btn gap-1 normal-case btn-ghost'>
          <svg
            width='20'
            height='20'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            className='inline-block h-5 w-5 stroke-current md:h-6 md:w-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
            ></path>
          </svg>
          <span className='hidden md:inline'>主题</span>
          <svg
            width='12px'
            height='12px'
            className='ml-1 hidden h-3 w-3 fill-current opacity-60 sm:inline-block'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 2048 2048'
          >
            <path d='M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z'></path>
          </svg>
        </div>
        <div className='dropdown-content bg-base-300 text-base-content rounded-box top-px max-h-96 h-[70vh] w-60 overflow-y-auto shadow-2xl mt-16'>
          <div className='grid grid-cols-1 gap-3 p-3' tabIndex={0}>
            {themeList.map(theme => {
              return (
                <button
                  key={theme}
                  className='outline-base-content overflow-hidden rounded-lg text-left'
                  onClick={() => {
                    userStore.setSettings({ theme: theme })
                  }}
                >
                  <div
                    data-theme={theme}
                    className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                  >
                    <div className='grid grid-cols-5 grid-rows-3 h-12'>
                      <div className='col-span-5 row-span-3 row-start-1 flex gap-2 py-3 px-4 items-center'>
                        <div className='w-5'>{userStore.settings.theme === theme ? '👉' : null}</div>
                        <div className='flex-grow text-sm font-bold'>{theme}</div>
                        <div className='flex flex-shrink-0 flex-wrap gap-1 h-full'>
                          <div className='bg-primary w-2 rounded'></div>
                          <div className='bg-secondary w-2 rounded'></div>
                          <div className='bg-accent w-2 rounded'></div>
                          <div className='bg-neutral w-2 rounded'></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default observer(Navbar)
