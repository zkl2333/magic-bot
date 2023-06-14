import requestHandler from '@/service/request'
import { ActionFunction, LoaderFunction, useLoaderData, useSubmit } from 'react-router-dom'
import { openAddOrEditSubscriptionServiceLimitModal } from './AddOrEditSubscriptionServiceLimitModal'

export const subscriptionServiceLimitLoader: LoaderFunction = async () => {
  const subscription = await requestHandler('/api/subscription')
  const serviceList = await requestHandler('/api/subscription/service')
  return { subscription, serviceList }
}

export const subscriptionServiceLimitAction: ActionFunction = async ({ request }) => {
  let formData = await request.formData()
  const data = Object.fromEntries(formData.entries())
  switch (request.method) {
    case 'DELETE': {
      return requestHandler('/api/subscription/service-limit', {
        method: 'DELETE',
        body: JSON.stringify(data)
      })
    }
    case 'POST': {
      return requestHandler('/api/subscription/service-limit', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    }
  }
}

export interface ISubscriptionServiceLimit {
  subscriptionId: string
  serviceType: string
  usageLimits: string
}

const SubscriptionServiceLimit = () => {
  const { subscription, serviceList } = useLoaderData() as any
  const submit = useSubmit()

  const save = async (data: ISubscriptionServiceLimit) => {
    const formData = new FormData()
    formData.append('subscriptionId', data.subscriptionId)
    formData.append('serviceType', data.serviceType)
    formData.append('usageLimits', data.usageLimits)
    await submit(formData, {
      method: 'POST'
    })
  }

  return (
    <ul className='menu w-full'>
      {subscription?.data.map((item: any) => {
        return (
          <li key={item.id} className=''>
            <details open>
              <summary>{item.name}</summary>
              <ul>
                {serviceList?.data.map((service: any) => {
                  const limit = item.subscriptionServiceLimits.find(
                    (s: any) => s.serviceType === service.type
                  ) || {
                    subscriptionId: item.id,
                    serviceType: service.type
                  }
                  return (
                    <li key={service.type}>
                      <a>
                        <div>
                          {service.name}({limit?.usageLimits === undefined ? '无限制' : limit?.usageLimits})
                        </div>
                        <div>
                          <div
                            className='btn btn-xs btn-primary'
                            onClick={e => {
                              e.preventDefault()
                              openAddOrEditSubscriptionServiceLimitModal({
                                subscriptionServiceLimit: limit,
                                services: serviceList?.data,
                                onSubmit: save
                              })
                            }}
                          >
                            编辑
                          </div>
                        </div>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </details>
          </li>
        )
      })}
    </ul>
  )
}

export default SubscriptionServiceLimit
