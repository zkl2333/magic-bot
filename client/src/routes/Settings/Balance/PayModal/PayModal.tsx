import dialogStore, { DialogProps } from '@/components/PortalDialog/dialogStore'
import requestHandler from '@/service/request'
import userStore from '@/store/UserStore'
import { useState } from 'react'

interface PayModalProps {
  points: number
  onFinish: () => void
}

function PayModal({ id, points, onFinish }: PayModalProps & DialogProps) {
  console.log('PayModal', id, points)
  const [order, setOrder] = useState<{
    id: string
    name: string
    payType: string
    price: string
    userId: string
    notifyUrl: string
    sign: string
  } | null>(null)
  const [qrcode, setQrcode] = useState<string>('')

  const handleBuy = async (points: number) => {
    const url = 'https://xorpay.com/api/cashier/25266'
    const qrUrl = 'https://xorpay.com/qr?data='

    const res = await requestHandler('/api/orders/create', {
      method: 'POST',
      body: JSON.stringify({
        name: `${points} 积分`,
        payType: 'jsapi',
        orderUid: userStore.id.toString(),
        points: points,
        notifyUrl: 'https://ai.zkl2333.com/api/orders/payment-callback'
      })
    })

    setOrder(res.data)

    const payPrarms = {
      name: res.data.name,
      pay_type: res.data.payType,
      price: res.data.price,
      order_id: res.data.id,
      order_uid: res.data.userId,
      notify_url: res.data.notifyUrl,
      sign: res.data.sign
    }

    const payUrl = url + '?' + new URLSearchParams(payPrarms)
    const imgUrl = qrUrl + encodeURIComponent(payUrl)
    setQrcode(imgUrl)
  }

  return (
    <dialog className='modal modal-bottom sm:modal-middle' open onClose={() => dialogStore.closeDialog(id)}>
      <div className='modal-box'>
        {order === null && (
          <button
            className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
            onClick={() => dialogStore.closeDialog(id)}
          >
            ✕
          </button>
        )}
        <h3 className='font-bold text-lg'>购买积分</h3>
        <p className='py-4'>您将购买 {points} 积分, 点击下方按钮后，将展示二维码，使用微信扫码完成支付。</p>
        {order ? (
          <div className='flex justify-between flex-col sm:flex-row'>
            <div className='mx-auto mb-4 sm:mb-0'>
              <img src={qrcode} alt='' className='w-[200px] h-[200px]' />
            </div>
            <div className='flex-1 pl-4 flex flex-col items-center'>
              {/* 订单信息 */}
              <div className='flex-1 mb-4'>
                <div>订单名称：{order.name}</div>
                <div>订单金额：{order.price} 元</div>
              </div>
              <div className='space-x-4 flex justify-end'>
                <button
                  className='btn'
                  onClick={() => {
                    dialogStore.closeDialog(id)
                  }}
                >
                  取消支付
                </button>
                <button
                  className='btn btn-primary'
                  onClick={() => {
                    dialogStore.closeDialog(id)
                    onFinish()
                  }}
                >
                  已完成支付
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex justify-center'>
            <button className='btn btn-primary' onClick={() => handleBuy(points)}>
              创建订单
            </button>
          </div>
        )}
      </div>
      {order === null && (
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      )}
    </dialog>
  )
}

export const openPayModal = (props: PayModalProps) => {
  console.log('openPayModal', props)
  dialogStore.openDialog(PayModal, props)
}

export default PayModal
