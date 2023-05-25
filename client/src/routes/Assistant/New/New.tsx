import classNames from 'classnames'
import { defaultAssistantList } from '../constants'
import { useFetcher, useOutletContext } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { useEffect } from 'react'
import { RootContextProps } from '../../Root/Root'
import OpenaiIcon from '../../../components/OpenaiIcon'

const New = () => {
  const fetcher = useFetcher()
  const { setTitle } = useOutletContext<RootContextProps>()

  useEffect(() => {
    setTitle('新建助手')
    return () => {
      setTitle('')
    }
  }, [setTitle])

  return (
    <div className='h-full grid justify-center grid-cols-[repeat(auto-fit,minmax(200px,auto))] gap-4 p-6 overflow-y-auto'>
      {defaultAssistantList.map(assistant => (
        <div
          key={assistant.id}
          className={classNames(
            'p-4 lg:p-8 shadow bg-base-100 hover:bg-base-300 rounded-xl cursor-pointer h-full flex-1 flex flex-col justify-center items-center'
          )}
          onClick={() => {
            let formData = new FormData()
            formData.append('assistant', JSON.stringify({ ...assistant, id: uuidv4() }))
            fetcher.submit(formData, {
              action: '/assistant',
              method: 'post'
            })
          }}
        >
          <div className='online avatar mb-3'>
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
      ))}
    </div>
  )
}

export default New
