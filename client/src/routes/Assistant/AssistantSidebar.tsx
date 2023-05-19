import classNames from 'classnames'
import AssistantItem from './components/AssistantItem'
import { NavLink, useFetcher } from 'react-router-dom'
import { Assistant } from './types'
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone'

const AssistantSidebar = ({ assistantList }: { assistantList: Assistant[] }) => {
  const fetcher = useFetcher()

  return (
    <div className='overflow-hidden h-full w-60 text-base-content border-base-300 border-r bg-base-200'>
      <div className='h-full flex flex-col justify-between safe-area'>
        <div className='border-b border-base-300 flex justify-center items-center p-3 text-center h-16'>
          <NavLink
            to='new'
            className={({ isActive }) =>
              classNames('btn btn-ghost normal-case text-xl w-full h-full', {
                'bg-base-300': isActive
              })
            }
          >
            添加
          </NavLink>
        </div>
        <div className='flex-1 overflow-auto'>
          {assistantList.map(assistant => (
            <NavLink
              key={assistant.id}
              to={`/assistant/${assistant.id}`}
              className={({ isActive }) =>
                classNames('px-4 py-3 block', {
                  'bg-base-300': isActive
                })
              }
            >
              {({ isActive }) => (
                <div className='flex justify-between items-center '>
                  <AssistantItem className='w-0 flex-1' isActive={isActive} assistant={assistant} />
                  <HighlightOffTwoToneIcon
                    className='flex-shrink-0 opacity-20 hover:opacity-70'
                    fontSize='small'
                    onClick={async e => {
                      e.stopPropagation()
                      e.preventDefault()
                      const data = new FormData()
                      data.append('assistantId', assistant.id)
                      fetcher.submit(data, {
                        method: 'delete',
                        action: '/assistant?index'
                      })
                    }}
                  />
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AssistantSidebar
