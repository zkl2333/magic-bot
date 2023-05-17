import interactionStore from '../../../store/InteractionStore'
import classnames from 'classnames'
import Popper from '@mui/base/Popper'
import { useState } from 'react'
import ClickAwayListener from '@mui/base/ClickAwayListener'
import { IInteraction } from '../../../types'
import { observer } from 'mobx-react-lite'
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone'
import { NavLink, useNavigate } from 'react-router-dom'

const InteractionItem = ({ interactions }: { interactions: IInteraction }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleDelete = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'delete-interactions-popper' : undefined

  let navigate = useNavigate()
  return (
    <>
      <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
        <NavLink
          to={`/interaction/${interactions.id}`}
          className={({ isActive, isPending }) => {
            return classnames('btn w-full h-auto px-4 flex justify-between items-center', {
              'btn-ghost': !isActive,
              'btn-primary': isActive,
              'btn-secondary': isPending
            })
          }}
        >
          <div className='truncate overflow-hidden flex-1 text-left'>{interactions.title || '未命名'}</div>
          <HighlightOffTwoToneIcon
            className='opacity-20 hover:opacity-70'
            fontSize='small'
            onClick={handleDelete}
          />
          <Popper
            id={id}
            open={open}
            anchorEl={anchorEl}
            placement='bottom'
            className='z-10 bg-base-100 w-[180px] p-3 rounded shadow'
            container={document.getElementById('app')}
            onClick={e => e.stopPropagation()}
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
                  className='ml-2 btn btn-outline btn-xs border-error  hover:bg-error hover:border-error text-error hover:text-base-100'
                  onClick={e => {
                    e.stopPropagation()
                    interactionStore.deleteInteraction(interactions.id)
                    navigate(`/interaction/${interactionStore.currentInteractionId}`)
                    setAnchorEl(null)
                  }}
                >
                  删除
                </div>
              </div>
            </div>
          </Popper>
        </NavLink>
      </ClickAwayListener>
    </>
  )
}

export default observer(InteractionItem)
