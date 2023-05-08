import useSWR from 'swr'
import { fetcher } from '../fetcher'

type VerifyResponse = {
  verified: boolean
}

const useVerifyToken = () => {
  const token = localStorage.getItem('token')
  const { data, error, isLoading } = useSWR<VerifyResponse>(
    token ? ['/api/user/verify', token] : null,
    ([url]: [string]) =>
      fetcher(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
  )

  const isVerified = !!data?.verified

  if (!isVerified && !isLoading) {
    localStorage.removeItem('token')
  }

  return { isVerified: isVerified, isLoading: isLoading, isError: error }
}

export default useVerifyToken
