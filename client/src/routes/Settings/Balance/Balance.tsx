import { useEffect } from 'react'
import { useLoaderData, useOutletContext, Link, useSubmit } from 'react-router-dom'
import { RootContextProps } from '../../Root/Root'
import { openPayModal } from './PayModal/PayModal'
import { getBalance, getPriceList } from '@/service/user'

export const balanceLoader = async () => {
  const balanceRes = await getBalance()
  const priceListRes = await getPriceList()
  const balance = await balanceRes.json()
  const priceList = await priceListRes.json()
  console.log('balanceLoader', balance, priceList)
  return { balance, priceList }
}

const Balance = () => {
  const { setTitle } = useOutletContext<RootContextProps>()
  const { balance, priceList } = useLoaderData() as {
    balance: { success: boolean; data: { points: number } }
    priceList: { success: boolean; data: { points: number; price: number }[] }
  }
  const submit = useSubmit()

  useEffect(() => {
    setTitle('账户余额')
    return () => {
      setTitle('')
    }
  }, [])

  return (
    <div className='w-full flex-1 p-4 space-y-4 overflow-y-auto'>
      <div>
        <div className='text-xl font-bold'>账户概览</div>
        <div className='mt-4 stats shadow'>
          <div className='stat'>
            <div className='stat-title'>账户余额</div>
            <div className='stat-value'>{balance.success ? balance.data.points : '错误'}</div>
            <div className='stat-desc'>积分</div>
          </div>
        </div>
      </div>
      {priceList.success && (
        <div>
          <div className='text-xl font-bold'>购买积分</div>
          <div className='mt-4'>
            {priceList.data.map(item => (
              <div key={item.points} className='w-[220px] mr-4 mb-4 stats shadow'>
                <div className='stat'>
                  <div className='stat-title'>积分</div>
                  <div className='stat-value'>{item.points}</div>
                  <div className='stat-desc'>约 {item.points * 50} Token（GPT3.5）</div>
                  <div className='stat-actions'>
                    <button
                      className='btn btn-sm btn-primary'
                      onClick={() =>
                        openPayModal({
                          ...item,
                          onFinish: () => {
                            // TODO: 购买成功后，查询订单状态，刷新积分
                            submit(null)
                          }
                        })
                      }
                    >
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
      )}
    </div>
  )
}

export default Balance
