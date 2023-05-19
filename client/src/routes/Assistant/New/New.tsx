import classNames from 'classnames'
import AssistantItem from '../components/AssistantItem'
import { defaultAssistantList } from '../constants'
import { useFetcher } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

const New = () => {
  const fetcher = useFetcher()
  return (
    <div className='h-full grid justify-center grid-cols-[repeat(auto-fill,200px)] gap-4 p-6 overflow-y-auto'>
      {defaultAssistantList.map(assistant => (
        <div
          key={assistant.id}
          className={classNames('px-4 py-3 block')}
          onClick={() => {
            let formData = new FormData()
            formData.append('assistant', JSON.stringify({ ...assistant, id: uuidv4() }))
            fetcher.submit(formData, {
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