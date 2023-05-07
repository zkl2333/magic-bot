import app from './app'
import findProcess from 'find-process'
import { exec } from 'child_process'
import os from 'os'

const port = 3001

// 杀死占用端口的进程
function killProcessOnPort(port: number) {
  return new Promise<void>((resolve, reject) => {
    findProcess('port', port)
      .then(processList => {
        if (processList.length === 0) {
          console.log(`No process found on port ${port}.`)
          resolve()
        }

        processList.forEach(process => {
          console.log(`Killing process with PID ${process.pid} on port ${port}...`)
          const killCommand =
            os.platform() === 'win32' ? `taskkill /F /PID ${process.pid}` : `kill ${process.pid}`
          exec(killCommand, (err, stdout, stderr) => {
            if (err) {
              console.error(`Error: ${err}`)
              reject(err)
            }
            console.log(`Process with PID ${process.pid} killed successfully.`)
            resolve()
          })
        })
      })
      .catch(err => {
        console.error(err)
        reject(err)
      })
  })
}

// 启动 Koa 服务器
async function startKoa() {
  try {
    await killProcessOnPort(port)
  } catch (err) {
    console.error('Failed to kill process on port.')
  }

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
  })
}

startKoa()
