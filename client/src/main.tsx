import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './common/index.css'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { SnackbarProvider } from 'notistack'

dayjs.locale('zh-cn')

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // 在这里弹出通知或以其他方式提示用户刷新页面
    if (window.confirm('新内容可用。 您要刷新页面吗？')) {
      window.location.reload()
    }
  })
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      classes={{
        containerRoot: 'lg:!top-8 lg:!right-8'
      }}
      style={{ top: '4rem' }}
      autoHideDuration={1000}
    >
      <App />
    </SnackbarProvider>
  </React.StrictMode>
)
