import { useEffect } from 'react'
import { useLoaderData, useOutletContext, Link } from 'react-router-dom'
import { RootContextProps } from '../../Root/Root'
import userStore from '@/store/UserStore'
import requestHandler from '@/service/request'

// 积分价格
const priceList = [
  { points: 10, price: 0.01 },
  { points: 10000, price: 10 },
  { points: 20000, price: 20 },
  { points: 50000, price: 50 },
  { points: 100000, price: 100 }
]

const Balance = () => {
  const { setTitle } = useOutletContext<RootContextProps>()
  const data = useLoaderData() as any

  useEffect(() => {
    setTitle('账户余额')
    return () => {
      setTitle('')
    }
  }, [])

  const handleBuy = async (item: { points: number; price: number }) => {
    const url = 'https://xorpay.com/api/cashier/25266'
    const qrUrl = 'https://xorpay.com/qr?data='

    const order = await requestHandler('/api/orders/create', {
      method: 'POST',
      body: JSON.stringify({
        name: `${item.points} 积分`,
        payType: 'jsapi',
        orderUid: userStore.id.toString(),
        points: item.points,
        notifyUrl: 'https://ai.zkl2333.com/api/orders/payment-callback'
      })
    })

    const payPrarms = {
      name: order.data.name,
      pay_type: order.data.payType,
      price: order.data.price,
      order_id: order.data.id,
      order_uid: order.data.orderUid,
      notify_url: order.data.notifyUrl,
      sign: order.data.sign
    }

    const payUrl = url + '?' + new URLSearchParams(payPrarms)
    const imgUrl = qrUrl + encodeURIComponent(payUrl)
    console.log(imgUrl)
  }

  return (
    <div className='w-full flex-1 p-4 space-y-4'>
      {/* 购买积分 */}
      <div>
        <div className='text-xl font-bold'>账户概览</div>
        <div className='mt-4 stats shadow'>
          <div className='stat'>
            <div className='stat-title'>账户余额</div>
            <div className='stat-value'>{data.success ? data.data.points : '错误'}</div>
            <div className='stat-desc'>积分</div>
          </div>
        </div>
      </div>

      <div>
        <div className='text-xl font-bold'>购买积分(测试中)</div>
        <div className='mt-4'>
          {priceList.map(item => (
            <div key={item.points} className='w-[220px] mr-4 mb-4 stats shadow'>
              <div className='stat'>
                <div className='stat-title'>积分</div>
                <div className='stat-value'>{item.points}</div>
                <div className='stat-desc'>约 {item.points * 50} Token（GPT3.5）</div>
                <div className='stat-actions'>
                  <button className='btn btn-sm btn-primary' onClick={() => handleBuy(item)}>
                    购买 ￥{item.price}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='mt-2 text-base-content/60'>
          <p>购买积分后，可以用于和智能助手的对话，每次对话会按照 Token 消耗积分。</p>
          <p>
            Token 是 GPT 处理文本的基本单位。简而言之，Token
            可以是一个字、一个词或特定语言中的一个字符。它们负责将输入的文本数据转换为 GPT
            可以处理的数据格式。
          </p>
          <p>
            具体积分和 Token 的消耗可在
            <Link className='px-1 link link-primary link-hover' to='/settings/transactions'>
              积分明细
            </Link>
            中查看。
          </p>
        </div>
      </div>
    </div>
  )
}

export default Balance
