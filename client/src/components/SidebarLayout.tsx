import classNames from 'classnames'

interface SidebarLayoutProps {
  className?: string
  showSidebar: boolean
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
  hasSidebar?: boolean
  children: React.ReactNode
  sidebarContent: React.ReactNode
  navBarContent?: React.ReactNode
  isAlwaysOpenOnDesktop?: boolean
}

export function SidebarLayout({
  className,
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
        className={classNames(
          'drawer w-full h-full bg-base-200',
          {
            'lg:drawer-open': isAlwaysOpenOnDesktop
          },
          className
        )}
      >
        <input
          className='drawer-toggle'
          type='checkbox'
          checked={showSidebar}
          onChange={e => {
            setShowSidebar(e.target.checked)
          }}
        />
        <div className='drawer-content w-full h-full overflow-hidden flex flex-col bg-base-200'>
          {children}
        </div>
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
