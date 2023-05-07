import app from './app'

// 杀死其他占用 3001 端口的进程
import fkill from 'fkill'
fkill(':3001', { force: true })

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001')
})
