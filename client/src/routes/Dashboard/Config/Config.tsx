import { getConfig, updateConfig } from '@/service/system'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { LoaderFunction, useLoaderData } from 'react-router-dom'

export const configLoader: LoaderFunction = async () => {
  const configs = await getConfig()
  return { configs }
}

const Config = () => {
  const { configs } = useLoaderData() as any
  const [configList, setConfigList] = useState(configs)
  const { enqueueSnackbar } = useSnackbar()

  return (
    <div className='p-4 w-full'>
      <table className='table bg-base-100 w-full'>
        {/* head */}
        <thead>
          <tr>
            <th>名称</th>
            <th>值</th>
            <th>是否公开</th>
          </tr>
        </thead>
        <tbody>
          {configList.map((item: any) => {
            return (
              <tr>
                <td>
                  <input
                    type='text'
                    placeholder='key'
                    className='input input-bordered input-primary w-full max-w-xs'
                    value={item.key}
                    onChange={e => {
                      item.key = e.target.value
                      setConfigList([...configList])
                    }}
                  />
                </td>
                <td>
                  <input
                    type='text'
                    placeholder='value'
                    className='input input-bordered input-primary w-full max-w-xs'
                    value={item.value}
                    onChange={e => {
                      item.value = e.target.value
                      setConfigList([...configList])
                    }}
                  />
                </td>
                <td>
                  <input
                    type='checkbox'
                    className='toggle toggle-primary'
                    checked={item.public}
                    onChange={e => {
                      item.public = e.target.checked
                      setConfigList([...configList])
                    }}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className='text-sm text-gray-500 my-4'>* 请谨慎修改配置，修改后可能会导致系统异常</div>
      <div className='flex space-x-4'>
        <div
          className='btn btn-neutral btn-sm'
          onClick={() => {
            setConfigList([
              ...configList,
              {
                key: '',
                value: '',
                public: false
              }
            ])
          }}
        >
          添加
        </div>
        <div
          className='btn btn-primary btn-sm'
          onClick={async () => {
            const res = await updateConfig(configList)
            if (res.success) {
              enqueueSnackbar('保存成功', { variant: 'success' })
              // 刷新页面
              setConfigList(res.data)
            } else {
              enqueueSnackbar(res.message, { variant: 'error' })
            }
          }}
        >
          保存
        </div>
      </div>
    </div>
  )
}

export default Config
