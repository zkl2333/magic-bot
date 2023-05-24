import { useEffect } from 'react'
import { useLoaderData, useOutletContext } from 'react-router-dom'
import { RootContextProps } from '../../Root/Root'

const Balance = () => {
  const { setTitle } = useOutletContext<RootContextProps>()
  const data = useLoaderData() as any

  useEffect(() => {
    setTitle('账户余额')
    return () => {
      setTitle('')
    }
  }, [])

  return (
    <div className='w-full flex-1 p-4'>
      {data.success && (
        <div className='stats shadow'>
          <div className='stat'>
            <div className='stat-title'>账户余额</div>
            <div className='stat-value'>{data.data.points}</div>
            <div className='stat-desc'>积分</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Balance
