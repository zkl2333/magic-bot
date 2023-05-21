import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { RootContextProps } from '../../Root/Root'

const Balance = () => {
  const { setTitle } = useOutletContext<RootContextProps>()

  useEffect(() => {
    setTitle('账户余额')
    return () => {
      setTitle('')
    }
  }, [])

  return <div className='w-full flex-1 p-4'>开发中。。。</div>
}

export default Balance
