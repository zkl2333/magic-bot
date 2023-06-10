import dialogStore, { DialogProps } from '@/components/PortalDialog/dialogStore'
import { useState } from 'react'

export type Service = {
  id?: number
  name: string
  description: string
  type: string
}

interface AddOrEditServiceModalProps {
  service?: Service
  onSubmit: (service: Service) => void
}

const AddOrEditServiceModal = ({
  dialogId,
  service: service,
  onSubmit
}: DialogProps & AddOrEditServiceModalProps) => {
  const [serviceData, setServiceData] = useState<Service>(
    service || {
      name: '',
      description: '',
      type: ''
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
        <h3 className='font-bold text-lg'>添加服务</h3>
        <div>
          <input type='hidden' name='id' value={serviceData?.id} />
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>名称</span>
            </label>
            <input
              type='text'
              placeholder='请输入名称'
              className='input input-bordered'
              name='name'
              value={serviceData?.name}
              onChange={e => {
                setServiceData(serviceData => {
                  return { ...serviceData, name: e.target.value }
                })
              }}
            />
          </div>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>描述</span>
            </label>
            <input
              type='text'
              placeholder='请输入描述'
              className='input input-bordered'
              name='description'
              value={serviceData?.description}
              onChange={e => {
                setServiceData(serviceData => {
                  return { ...serviceData, description: e.target.value }
                })
              }}
            />
          </div>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>类型</span>
            </label>
            <input
              type='text'
              placeholder='请输入类型'
              className='input input-bordered'
              name='type'
              value={serviceData?.type}
              onChange={e => {
                setServiceData(serviceData => {
                  return { ...serviceData, type: e.target.value }
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
                onSubmit(serviceData)
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

export const openAddOrEditServiceModal = (props: AddOrEditServiceModalProps) => {
  console.log('openPayModal', props)
  dialogStore.openDialog(AddOrEditServiceModal, props)
}
