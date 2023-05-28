import classNames from 'classnames'
import { useFetcher } from 'react-router-dom'
import OpenaiIcon from '../../../components/OpenaiIcon'
import { Assistant } from '../../../service/assistant'
import userStore from '../../../store/UserStore'
import { useNavigate } from 'react-router-dom'

export const PublicAssistantItem = ({
  assistant,
  isOnline,
  onClick
}: {
  assistant: Omit<Assistant, 'isPublic' | 'createdAt' | 'updatedAt'>
  isOnline?: boolean
  onClick: () => void
}) => {
  const navigate = useNavigate()
  const fetcher = useFetcher()

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
      <div>
        <div className='text-sm text-base-content/70'>
          作者：{assistant.author.nickname || assistant.author.username}
        </div>
        {assistant.author.id === userStore.id && (
          <div className='flex justify-center space-x-2 mt-2'>
            <div
              className='btn btn-xs btn-ghost'
              onClick={e => {
                e.stopPropagation()
                navigate(`/assistant/${assistant.id}/edit`)
              }}
            >
              编辑
            </div>
            <div
              className='btn btn-xs btn-ghost'
              onClick={e => {
                e.stopPropagation()
                let formData = new FormData()
                formData.append('assistantId', assistant.id.toString())
                fetcher.submit(formData, {
                  action: '/assistant',
                  method: 'delete'
                })
              }}
            >
              删除
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
