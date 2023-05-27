import classNames from 'classnames'
import { defaultAssistantList } from '../constants'
import { useFetcher, useLoaderData, useOutletContext } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { useEffect } from 'react'
import { RootContextProps } from '../../Root/Root'
import OpenaiIcon from '../../../components/OpenaiIcon'
import { Assistant } from '../../../service/assistant'

const AssistantItem = ({
  assistant,
  isOnline,
  onClick
}: {
  assistant: Omit<Assistant, 'createdAt' | 'updatedAt'>
  isOnline?: boolean
  onClick?: () => void
}) => {
  return (
    <div
      key={assistant.id}
      className={classNames(
        'p-4 shadow bg-base-100 hover:bg-base-300 rounded-xl cursor-pointer h-full flex-1 flex flex-col justify-center items-center'
      )}
      onClick={onClick}
    >
      <div
        className={classNames('avatar mb-3', {
          online: isOnline
        })}
      >
        <div className='rounded-full bg-base-content h-16 w-16 bg-opacity-10'>
          {assistant.avatar ? (
            <img src={assistant.avatar} />
          ) : (
            <OpenaiIcon
              style={{
                backgroundColor: 'rgb(16, 163, 127)'
              }}
              className='p-1.5 text-[#fff]'
            />
          )}
        </div>
      </div>
      <div className='text-center'>
        <div className='text-lg font-extrabold'>{assistant.name}</div>
        <div className='text-base-content/70 my-3 text-sm'>{assistant.description}</div>
      </div>
    </div>
  )
}

const New = () => {
  const fetcher = useFetcher()
  const { setTitle } = useOutletContext<RootContextProps>()

  useEffect(() => {
    setTitle('新建助手')
    return () => {
      setTitle('')
    }
  }, [setTitle])

  const { assistants } = useLoaderData() as { assistants: Assistant[] }

  return (
    <div className='h-full grid justify-center grid-cols-[repeat(auto-fit,minmax(150px,auto))] lg:grid-cols-[repeat(auto-fit,minmax(300px,auto))] gap-4 p-6 overflow-y-auto'>
      {assistants.map(assistant => (
        <AssistantItem
          isOnline
          assistant={assistant}
          onClick={() => {
            let formData = new FormData()
            formData.append('assistant', JSON.stringify({ ...assistant, interactionIds: [] }))
            fetcher.submit(formData, {
              action: '/assistant',
              method: 'post'
            })
          }}
        />
      ))}
      {defaultAssistantList.map(assistant => (
        <AssistantItem
          assistant={{
            ...assistant,
            config: assistant.config
          }}
          onClick={() => {
            let formData = new FormData()
            formData.append('assistant', JSON.stringify({ ...assistant, id: uuidv4() }))
            fetcher.submit(formData, {
              action: '/assistant',
              method: 'post'
            })
          }}
        />
      ))}
    </div>
  )
}

export default New
