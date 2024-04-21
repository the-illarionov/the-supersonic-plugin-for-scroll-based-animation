function toFixed(number: number, precision: number) {
  precision = 10 ** precision
  return ~~(number * precision) / precision
}

function debounce(func: Function, time: number) {
  let timeout: any
  return function () {
    clearTimeout(timeout)
    // @ts-expect-error this
    timeout = setTimeout(() => func.apply(this), time)
  }
}

function generateId(): string {
  return Math.random().toString(16).substring(2)
}

export {
  toFixed,
  debounce,
  generateId,
}
