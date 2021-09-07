export function getQuery(): Record<string, string> {
  return window.location.search
    .replace('?', '')
    .split('&')
    .reduce((res, item) => {
      const [key, value] = item.split('=')
      return { ...res, [key]: value }
    }, {})
}

export function objectToForm(object: any): string {
  return Object.keys(object).reduce((form: string, key: string) => {
    const spacer: string = form ? '&' : ''
    return `${form}${spacer}${key}=${encodeURIComponent(object[key])}`
  }, '')
}
