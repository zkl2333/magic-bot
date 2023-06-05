import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { observer } from 'mobx-react-lite'
import dialogStore from './dialogStore'

const Dialog: React.FC = observer(() => {
  const el = document.createElement('div')
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    root?.appendChild(el)

    return () => {
      root?.removeChild(el)
    }
  }, [el])

  return (
    <>
      <div ref={rootRef}></div>
      {dialogStore.dialogs.map(({ id, content: Content, props }) =>
        ReactDOM.createPortal(<Content key={id} id={id} {...props} />, el)
      )}
    </>
  )
})

export default Dialog
