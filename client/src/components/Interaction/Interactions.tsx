import interactionStore from '../../store/InteractionStore'
import classNames from 'classnames'
import Popper from '@mui/base/Popper'
import { useState } from 'react'
import ClickAwayListener from '@mui/base/ClickAwayListener'
import { Interaction } from '../../types'
import { observer } from 'mobx-react-lite'

const Interactions = (item: Interaction) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popper' : undefined

  return (
    <>
      <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
        <button
          className={classNames('btn w-full h-auto px-4 flex justify-between items-center', {
            'btn-ghost': interactionStore.currentInteractionId !== item.id,
            'btn-primary': interactionStore.currentInteractionId === item.id
          })}
          onClick={() => {
            interactionStore.setCurrentInteractionId(item.id)
          }}
        >
          <div className='truncate overflow-hidden flex-1 text-left'>{item.title || '未命名对话'}</div>
          <>
            <div>
              <div className='btn btn-xs btn-ghost' onClick={handleClick}>
                删除
              </div>
            </div>
            <Popper
              id={id}
              open={open}
              anchorEl={anchorEl}
              placement='bottom'
              className='z-10 bg-base-100 w-[180px] p-3 rounded shadow'
              container={document.getElementById('app')}
            >
              <div>
                <div className='mb-4'>是否确认删除?</div>
                <div className='flex justify-end'>
                  <div
                    className='ml-2 btn btn-outline btn-xs'
                    onClick={e => {
                      e.stopPropagation()
                      setAnchorEl(null)
                    }}
                  >
                    取消
                  </div>
                  <div
                    className='ml-2 btn btn-error btn-outline btn-xs'
                    onClick={e => {
                      e.stopPropagation()
                      interactionStore.deleteInteraction(item.id)
                      setAnchorEl(null)
                    }}
                  >
                    删除
                  </div>
                </div>
              </div>
            </Popper>
          </>
        </button>
      </ClickAwayListener>
    </>
  )
}

export default observer(Interactions)
