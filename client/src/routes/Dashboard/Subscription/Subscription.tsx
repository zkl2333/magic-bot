import requestHandler from '@/service/request'
import { ActionFunction, Form, LoaderFunction, useLoaderData, useSubmit } from 'react-router-dom'

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

  const save = async (data: any) => {}

  return (
    <div className='p-4 w-full'>
      <div
        className='btn btn-primary mb-4 btn-sm'
        onClick={() => {
          const formData = new FormData()
          formData.append('name', 'test')
          formData.append('isMonthly', 'true')
          formData.append('duration', '1')
          formData.append('price', '10')
          submit(formData, {
            method: 'POST'
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
                  <div className='btn btn-xs btn-ghost' onClick={() => {}}>
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
