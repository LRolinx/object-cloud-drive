export const wait = (time: number = 1000) =>
  new Promise((resolve) => {
    setTimeout(resolve, time)
  })

/**
 * 防抖处理函数
 *
 * const debounce = Debounce(1000)
 * async () => await debounce()
 * @param time 间隔时间
 */
export const Debounce = (time: number) => {
  let timer: NodeJS.Timeout | undefined
  return () =>
    new Promise<void>((resolve) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        resolve()
        timer = undefined
      }, time)
    })
}

/**
 * 节流处理函数 第一次执行和最后一次执行
 * @param time 间隔时间
 */
export const Throttle = (time: number) => {
  let timer: NodeJS.Timeout | undefined
  return () =>
    new Promise<void>((resolve) => {
      if (timer) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          timer = undefined
          resolve()
        }, time)
        return
      } else {
        resolve()
        timer = setTimeout(() => {
          timer = undefined
        }, time)
      }
    })
}

type RequestAnimationFrame = typeof window.requestAnimationFrame
/**
 * 在屏幕下一帧渲染之前执行
 */
export const raf = (): RequestAnimationFrame => {
  if (window.requestAnimationFrame) {
    return window.requestAnimationFrame
  }
  const throttle = Throttle(16)
  return (callback) => {
    let start = Date.now()
    throttle().then(() => {
      const end = Date.now()
      callback(end - start)
      start = 0
    })
    return 0
  }
}

export const weekList = ['日', '一', '二', '三', '四', '五', '六']

/**
 * 通过日期获取星期
 * @param date 日期
 * @returns 星期
 */
export const getWeek = (date: Date | string | number) => {
  const day = new Date(date).getDay()
  return weekList[day]
}
