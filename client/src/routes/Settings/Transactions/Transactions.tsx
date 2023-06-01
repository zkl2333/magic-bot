import { useEffect } from 'react'
import { useLoaderData, useNavigate, useOutletContext } from 'react-router-dom'
import { RootContextProps } from '../../Root/Root'
import classNames from 'classnames'

const transactionTypeMap = {
  Income: '收入',
  Expense: '支出',
  Transfer: '转账'
}

const Transactions = () => {
  const { setTitle } = useOutletContext<RootContextProps>()
  const navigate = useNavigate()

  const { data } = useLoaderData() as {
    data: {
      totalPages: number
      currentPage: number
      pageSize: number
      totalRecords: number
      records: {
        description: string
        gmtCreate: string
        modelName: null
        points: number
        subKey: string
        transactionType: keyof typeof transactionTypeMap
        userId: string
      }[]
    }
  }

  useEffect(() => {
    setTitle('积分明细')
    return () => {
      setTitle('')
    }
  }, [])

  const renderPagination = () => {
    const { totalPages, currentPage } = data
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

    return (
      pages.length > 0 && (
        <div className='join border-2'>
          <button
            className={classNames('join-item btn btn-sm', { 'btn-disabled': currentPage === 1 })}
            onClick={() => {
              navigate(`?page=${currentPage - 1}`)
            }}
          >
            «
          </button>
          <button className='join-item btn btn-sm'>
            {currentPage}/{totalPages}
          </button>
          <button
            className={classNames('join-item btn btn-sm ', { 'btn-disabled': currentPage === totalPages })}
            onClick={() => {
              navigate(`?page=${currentPage + 1}`)
            }}
          >
            »
          </button>
        </div>
      )
    )
  }

  return (
    <div className='w-full flex-1 p-4 flex flex-col overflow-hidden'>
      <div className='overflow-x-auto mb-4'>
        <table className='table table-zebra w-full min-w-[700px] bg-base-100'>
          <thead className='bg-base-200'>
            <tr>
              <th>交易时间</th>
              <th>交易类型</th>
              <th>积分</th>
              <th>模型</th>
              <th>描述</th>
            </tr>
          </thead>
          <tbody>
            {data.records.map(item => {
              return (
                <tr className='hover'>
                  <td>{item.gmtCreate}</td>
                  <td>
                    <span
                      className={classNames('badge', {
                        'badge-primary': item.transactionType === 'Income',
                        'badge-secondary': item.transactionType === 'Expense'
                      })}
                    >
                      {transactionTypeMap[item.transactionType]}
                    </span>
                  </td>
                  <td>{item.points}</td>
                  <td>{item.modelName}</td>
                  <td>{item.description}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className='flex justify-end'>{renderPagination()}</div>
    </div>
  )
}

export default Transactions
