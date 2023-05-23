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
      {data.success ? <pre className=' '>{JSON.stringify(data.data.points, null, 2)}</pre> : <></>}
    </div>
  )
}

export default Balance
