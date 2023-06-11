import dialogStore, { DialogProps } from '@/components/PortalDialog/dialogStore'
import { useState } from 'react'

export type Subscription = {
  id?: number
  name: string
  isMonthly: boolean
  duration: number
  price: number
}

interface AddOrEditSubscriptionModalProps {
  subscription?: Subscription
  onSubmit: (service: Subscription) => void
}

const AddOrEditSubscriptionModal = ({
  dialogId,
  subscription,
  onSubmit
}: DialogProps & AddOrEditSubscriptionModalProps) => {
  const [data, setData] = useState<Subscription>(
    subscription || {
      name: '',
      isMonthly: true,
      duration: 1,
      price: 0
    }
  )

  return (
    <dialog
      className='modal modal-bottom sm:modal-middle'
      open
      onClose={() => dialogStore.closeDialog(dialogId)}
    >
      <div className='modal-box'>
        <button
          className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
          onClick={() => dialogStore.closeDialog(dialogId)}
        >
          ✕
        </button>
        <h3 className='font-bold text-lg'>{`${data?.id ? '编辑' : '添加'}订阅`}</h3>
        <div>
          <input type='hidden' name='id' value={data?.id} />
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>名称</span>
            </label>
            <input
              type='text'
              placeholder='请输入名称'
              className='input input-bordered'
              name='name'
              value={data?.name}
              onChange={e => {
                setData(serviceData => {
                  return { ...serviceData, name: e.target.value }
                })
              }}
            />
          </div>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>是否按月计费</span>
            </label>
            <div className='flex items-center justify-between'>
              <input
                type='checkbox'
                className='checkbox'
                checked={data?.isMonthly}
                onChange={e => {
                  setData(serviceData => {
                    return { ...serviceData, isMonthly: e.target.checked }
                  })
                }}
              />
              {data?.isMonthly ? '是' : '否'}
            </div>
          </div>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>持续时间</span>
            </label>
            <input
              type='number'
              placeholder='请输入持续时间'
              className='input input-bordered'
              name='duration'
              value={data?.duration}
              onChange={e => {
                setData(serviceData => {
                  return { ...serviceData, duration: Number(e.target.value) }
                })
              }}
            />
          </div>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>价格</span>
            </label>
            <input
              type='number'
              placeholder='请输入价格'
              className='input input-bordered'
              name='price'
              value={data?.price}
              onChange={e => {
                setData(serviceData => {
                  return { ...serviceData, price: Number(e.target.value) }
                })
              }}
            />
          </div>
          <div className='modal-action'>
            <button className='btn' onClick={() => dialogStore.closeDialog(dialogId)}>
              取消
            </button>
            <button
              className='btn btn-primary'
              onClick={() => {
                dialogStore.closeDialog(dialogId)
                onSubmit(data)
              }}
            >
              提交
            </button>
          </div>
        </div>
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button>取消</button>
      </form>
    </dialog>
  )
}

export const openAddOrEditSubscriptionModal = (props: AddOrEditSubscriptionModalProps) => {
  dialogStore.openDialog(AddOrEditSubscriptionModal, props)
}
