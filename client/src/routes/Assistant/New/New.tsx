import classNames from 'classnames'
import AssistantItem from '../components/AssistantItem'
import { defaultAssistantList } from '../constants'
import { useFetcher, useOutletContext } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { AssistantLayoutContextProps } from '../AssistantLayout'
import { useEffect } from 'react'

const New = () => {
  const fetcher = useFetcher()
  const { setTitle } = useOutletContext<AssistantLayoutContextProps>()

  useEffect(() => {
    setTitle('新建助手')
    return () => {
      setTitle('')
    }
  }, [setTitle])

  return (
    <div className='h-full grid justify-center grid-cols-[repeat(auto-fill,minmax(200px,auto))] gap-4 p-6 overflow-y-auto'>
      {defaultAssistantList.map(assistant => (
        <div
          key={assistant.id}
          className={classNames(
            'px-4 py-3 block shadow bg-base-100 hover:bg-base-300 rounded-xl cursor-pointer'
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
          <AssistantItem isActive={false} assistant={assistant} />
        </div>
      ))}
    </div>
  )
}

export default New
