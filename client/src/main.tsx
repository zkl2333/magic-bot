import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './common/index.css'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { SnackbarProvider } from 'notistack'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    confirm('有新版本，是否更新？') && updateSW()
  },
  onOfflineReady() {
    console.log('offline ready')
  }
})

dayjs.locale('zh-cn')

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
