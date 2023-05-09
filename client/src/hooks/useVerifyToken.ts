import useSWR from 'swr'
import { fetcher } from '../fetcher'
import userStore from '../store/UserStore'

type VerifyResponse = {
  verified: boolean
}

const useVerifyToken = () => {
  const token = userStore.token
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
    userStore.logout()
  }

  return { isVerified: isVerified, isLoading: isLoading, isError: error }
}

export default useVerifyToken
