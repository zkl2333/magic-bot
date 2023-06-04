import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import dialogStore from './dialogStore'

const Dialog: React.FC = observer(() => {
  const el = document.createElement('div')
  const root = document.getElementById('dialog-root')

  useEffect(() => {
    root?.appendChild(el)

    return () => {
      root?.removeChild(el)
    }
  }, [el])

  return (
    <>
      {dialogStore.dialogs.map(({ id, content: Content, props }) =>
        ReactDOM.createPortal(<Content id={id} {...props} />, el)
      )}
    </>
  )
})

export default Dialog
