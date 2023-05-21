import { useState } from 'react'
import { Outlet } from 'react-router-dom'

export type RootContextProps = {
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
}

const Root = () => {
  const [title, _setTitle] = useState('')

  const setTitle = (title: string) => {
    _setTitle(title)
    document.title = `${title} - AI Web`
  }

  return (
    <Outlet
      context={{
        title,
        setTitle
      }}
    />
  )
}

export default Root
