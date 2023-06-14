import requestHandler from '@/service/request'
import { ActionFunction, Form, LoaderFunction, useLoaderData, useSubmit } from 'react-router-dom'
import { Subscription, openAddOrEditSubscriptionModal } from './AddOrEditSubscriptionModal'

export const subscriptionLoader: LoaderFunction = async () => {
  const res = await requestHandler('/api/subscription')
  return res
}

export const subscriptionAction: ActionFunction = async ({ request }) => {
  let formData = await request.formData()
  const data = Object.fromEntries(formData.entries())
  switch (request.method) {
    case 'DELETE': {
      return requestHandler('/api/subscription', {
        method: 'DELETE',
        body: JSON.stringify(data)
      })
    }
    case 'PUT': {
      return requestHandler('/api/subscription', {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    }
    case 'POST': {
      return requestHandler('/api/subscription', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    }
  }
}

const Service = () => {
  const loaderData = useLoaderData() as any
  const submit = useSubmit()

  const save = async (data: Subscription) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString())
    })
    if (data.id) {
      return await submit(formData, {
        method: 'PUT'
      })
    }
    await submit(formData, {
      method: 'POST'
    })
  }

  return (
    <div className='p-4 w-full'>
      <div
        className='btn btn-primary mb-4 btn-sm'
        onClick={() => {
          openAddOrEditSubscriptionModal({
            onSubmit: save
          })
        }}
      >
        添加
      </div>
      <table className='table table-zebra bg-base-100 w-full'>
        <thead>
          <tr>
            <th></th>
            <th>名称</th>
            <th>持续周期</th>
            <th>持续时间</th>
            <th>价格</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {loaderData?.data.map((item: any, index: number) => {
            return (
              <tr key={item.id} className='hover'>
                <th>{index + 1}</th>
                <td>{item.name}</td>
                <td>{item.isMonthly ? '月' : '天'}</td>
                <td>{item.duration}</td>
                <td>{item.price}</td>
                <td>
                  <div
                    className='btn btn-xs btn-ghost'
                    onClick={() => {
                      openAddOrEditSubscriptionModal({
                        subscription: {
                          id: item.id,
                          name: item.name,
                          isMonthly: item.isMonthly,
                          duration: item.duration,
                          price: item.price
                        },
                        onSubmit: save
                      })
                    }}
                  >
                    编辑
                  </div>
                  <Form method='delete' className='inline'>
                    <input type='hidden' name='id' value={item.id} />
                    <button type='submit' className='btn text-error btn-xs btn-ghost'>
                      删除
                    </button>
                  </Form>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Service
