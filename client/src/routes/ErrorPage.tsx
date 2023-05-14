import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error: any = useRouteError()
  console.error(error)

  return (
    <div className='error-page h-full flex flex-col justify-center items-center'>
      <h1 className='text-2xl mb-6'>Oops!</h1>
      <p className='mb-4'>Sorry, an unexpected error has occurred.</p>
      <p className='opacity-50'>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  )
}
