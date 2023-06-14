import requestHandler from '@/service/request'
import { LoaderFunction, useLoaderData } from 'react-router-dom'

export const mySubscriptionLoader: LoaderFunction = async () => {
  const mySubscriptionRes = await requestHandler('/api/users/me/subscription')
  const allSubscriptionRes = await requestHandler('/api/subscription')
  const serviceListRes = await requestHandler('/api/subscription/service')

  if (mySubscriptionRes.success && allSubscriptionRes.success) {
    return {
      mySubscription: mySubscriptionRes.data,
      allSubscription: allSubscriptionRes.data,
      serviceList: serviceListRes.data
    }
  }
  return {
    error: mySubscriptionRes.error || allSubscriptionRes.error || serviceListRes.error
  }
}

const mySubscription = () => {
  const { mySubscription, allSubscription, serviceList } = useLoaderData() as any

  return (
    <div className='flex-1 p-4 overflow-y-auto'>
      <div className='space-y-6'>
        <div>
          <div className='title text-3xl'>当前订阅</div>
          <div className='w-full max-w-[1200px] mt-4 grid justify-start grid-cols-[repeat(auto-fit,minmax(300px,400px))] gap-4'>
            {mySubscription
              ? mySubscription?.map((subscription: any) => {
                  JSON.stringify(subscription)
                })
              : '暂无订阅'}
          </div>
        </div>
        <div>
          <div className='title text-3xl'>所有订阅</div>
          <div className='w-full max-w-[1200px] mt-4 grid justify-start grid-cols-[repeat(auto-fit,minmax(300px,400px))] gap-4'>
            {allSubscription?.map((subscription: any) => {
              return (
                <div className='card w-full bg-base-100 shadow-xl'>
                  <div className='card-body'>
                    <h2 className='card-title'>{subscription.name}</h2>
                    <div className='text-3xl font-bold'>
                      {subscription.price}元/{subscription.duration}
                      {subscription.isMonthly ? '月' : '天'}
                    </div>
                    <ul>
                      {subscription.subscriptionServiceLimits.map((limit: any) => {
                        const nema = serviceList.find((s: any) => s.type === limit.serviceType)?.name
                        return (
                          <li>
                            <span>
                              可使用 {nema} {limit.usageLimits === -1 ? '无限' : limit.usageLimits}次
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                    <div className='card-actions justify-end'>
                      <button className='btn btn-disabled'>订阅</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {/* <pre>{JSON.stringify(mySubscription, null, 2)}</pre> */}
    </div>
  )
}

export default mySubscription
