// 工具函数：获取给定 localForage 实例中的所有条目
export async function getAllItems<T>(store: LocalForage): Promise<T[]> {
  const keys = await store.keys()
  const promises = keys.map(key => store.getItem(key).catch(() => null))
  const items = await Promise.all(promises)

  // 过滤掉 null 或 undefined 的条目，并将结果转型为 T[]
  return items.filter(Boolean) as T[]
}

export function throttle(fn: (...arg: any[]) => any, interval: number = 300) {
  let lock = false
  return function (this: unknown, ...args: any[]) {
    if (lock) return
    lock = true
    setTimeout(() => (lock = false), interval)
    fn.bind(this)(...args)
  }
}

export function debounce(fn: (...arg: any[]) => any, duration: number = 300) {
  let timer = -1
  return function (this: unknown, ...args: any[]) {
    if (timer > -1) {
      clearTimeout(timer)
    }
    timer = window.setTimeout(() => {
      fn.bind(this)(...args)
      timer = -1
    }, duration)
  }
}
