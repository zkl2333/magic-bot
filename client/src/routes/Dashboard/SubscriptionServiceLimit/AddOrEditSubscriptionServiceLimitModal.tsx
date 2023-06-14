import dialogStore, { DialogProps } from '@/components/PortalDialog/dialogStore'
import { useState } from 'react'
import { ISubscriptionServiceLimit } from './SubscriptionServiceLimit'

interface AddOrEditSubscriptionServiceLimitModalProps {
  subscriptionServiceLimit: ISubscriptionServiceLimit
  services: any[]
  onSubmit: (service: any) => void
}

const AddOrEditSubscriptionServiceLimitModal = ({
  subscriptionServiceLimit,
  services,
  dialogId,
  onSubmit
}: AddOrEditSubscriptionServiceLimitModalProps & DialogProps) => {
  const [data, setData] = useState<ISubscriptionServiceLimit>(subscriptionServiceLimit)

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
        <h3 className='font-bold text-lg'>编辑服务限制</h3>
        <div>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>服务</span>
              <select
                className='select select-bordered w-full max-w-xs'
                value={data.serviceType}
                onChange={e => setData({ ...data, serviceType: e.target.value })}
                disabled
              >
                <option value=''>请选择</option>
                {services.map((item: any) => (
                  <option key={item.type} value={item.type}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>限制</span>
              <input
                type='number'
                className='input input-bordered w-full max-w-xs'
                value={data.usageLimits || 0}
                onChange={e => setData({ ...data, usageLimits: e.target.value })}
              />
            </label>
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

export const openAddOrEditSubscriptionServiceLimitModal = (
  props: AddOrEditSubscriptionServiceLimitModalProps
) => {
  dialogStore.openDialog(AddOrEditSubscriptionServiceLimitModal, props)
}
