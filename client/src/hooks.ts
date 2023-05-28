import { useEffect, useRef } from 'react'

// 自定义hook函数，用于创建节流函数
export function useThrottle(fn: (...args: any[]) => void, delay: number) {
  const last = useRef(0)

  return (...args: any[]) => {
    const now = Date.now()
    if (now - last.current >= delay) {
      last.current = now
      fn(...args)
    }
  }
}

// 自定义hook函数，用于创建防抖函数
export function useDebounce(fn: (...args: any[]) => void, delay: number) {
  // 保存一个函数调用的定时器引用
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 清除现有定时器并开始一个新的定时器
  function debounce(...args: any[]) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => fn(...args), delay)
  }

  // 在组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debounce
}
