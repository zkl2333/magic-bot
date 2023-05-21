import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error: any = useRouteError()
  console.error(error)

  return (
    <div className='error-page h-full flex flex-col justify-center items-center'>
      <h1 className='text-2xl mb-6'>Oops!</h1>
      <p className='mb-4'>对不起，发生了一个意外的错误。</p>
      <p className='opacity-50'>
        <i>{error?.data?.message || error?.message || error?.statusText}</i>
      </p>
      <div className='mt-4 space-x-2'>
        <button
          className='btn btn-primary'
          onClick={() => {
            window.history.back()
          }}
        >
          返回上一页
        </button>
        <button
          className='btn btn-primary'
          onClick={() => {
            window.location.href = '/'
          }}
        >
          返回首页
        </button>
      </div>
    </div>
  )
}
