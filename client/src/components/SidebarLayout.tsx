import classNames from 'classnames'

interface SidebarLayoutProps {
  showSidebar: boolean
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
  hasSidebar?: boolean
  children: React.ReactNode
  sidebarContent: React.ReactNode
  navBarContent?: React.ReactNode
  isAlwaysOpenOnDesktop?: boolean
}

export function SidebarLayout({
  showSidebar,
  setShowSidebar,
  hasSidebar = true,
  children,
  sidebarContent,
  isAlwaysOpenOnDesktop = true
}: SidebarLayoutProps) {
  return (
    <>
      <div
        className={classNames('drawer h-full bg-base-200', {
          'lg:drawer-open': isAlwaysOpenOnDesktop,
        })}
      >
        <input
          className='drawer-toggle'
          type='checkbox'
          checked={showSidebar}
          onChange={e => {
            setShowSidebar(e.target.checked)
          }}
        />
        <div className='drawer-content flex flex-col bg-base-200'>{children}</div>
        {hasSidebar && (
          <div className='drawer-side h-full absolute'>
            <label
              className='drawer-overlay'
              onClick={() => {
                setShowSidebar(false)
              }}
            ></label>
            {sidebarContent}
          </div>
        )}
      </div>
    </>
  )
}
